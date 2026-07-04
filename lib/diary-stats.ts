import { COLORS } from "../theme";
import { DIARY_BADGES, DIARY_LEADERBOARD_USERS, DIARY_LEVEL_NAMES, FISH_SURVIVAL_TIERS, RU_MONTHS_GEN, TIER_COLORS, TIER_NAMES } from "../data/diary-content";
import { notifyTelegram } from "./notify";
import { readLocal, writeLocal } from "./storage";

export const PENDING_DIARY_TANK_KEY = "aqua_pending_diary_tank";


export function buildTankDraftFromCart(fishItems) {
  return {
    id: "tank_" + Date.now(),
    name: "Новый аквариум",
    volume: 100,
    emoji: "🌿",
    fish: fishItems.map((f, i) => ({ id: "tf_" + Date.now() + "_" + i, name: f.name, img: f.img, qty: 1, status: "ok" })),
    logs: [],
    waterChangeEvery: 7, lastWaterChange: 0,
    filterCleanEvery: 30, lastFilterClean: 0,
    feedingSchedule: "2 раза в день", notes: "", temperature: 25, ph: 7.0,
  };
}


export function formatDiaryDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso; // на случай старого формата строки
  return `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]}`;
}

export function diaryTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Считает текущую и лучшую серию дней подряд, в которые была хотя бы одна запись

export function computeDiaryStreaks(allDates) {
  const dates = Array.from(allDates).sort();
  if (dates.length === 0) return { current: 0, best: 0 };
  let best = 1, run = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const next = new Date(dates[i] + "T00:00:00");
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) run++;
    else if (diffDays > 1) run = 1;
    best = Math.max(best, run);
  }
  return { current: run, best }; // current = серия, заканчивающаяся последней записью
}


export function diaryMonthsNoLoss(tanks) {
  if (!tanks || tanks.length === 0) return 0;
  let minMonths = Infinity;
  tanks.forEach(t => {
    const ref = t.lastLossISO || t.careSinceISO;
    if (!ref) return; // нет данных по этому аквариуму — не учитываем в расчёте
    const days = diaryDaysSince(ref);
    minMonths = Math.min(minMonths, Math.floor(days / 30));
  });
  return Number.isFinite(minMonths) ? Math.max(0, minMonths) : 0;
}


export function computeDiaryStats(tanks) {
  let totalLogs = 0, water = 0, clean = 0, feed = 0, health = 0, note = 0;
  let totalFish = 0, maxVolume = 0, onTimeCare = 0;
  const typesUsed = new Set();
  const allDates = new Set();
  tanks.forEach(t => {
    totalFish += t.fish.reduce((s, f) => s + (f.status === "lost" ? 0 : f.qty), 0);
    maxVolume = Math.max(maxVolume, t.volume);
    t.logs.forEach(l => {
      totalLogs++;
      typesUsed.add(l.type);
      if (l.date) allDates.add(l.date);
      if (l.type === "water") water++;
      else if (l.type === "clean") clean++;
      else if (l.type === "feed") feed++;
      else if (l.type === "health") health++;
      else if (l.type === "note") note++;
      if (l.onTime && (l.type === "water" || l.type === "clean")) onTimeCare++;
    });
  });
  const streaks = computeDiaryStreaks(allDates);
  const monthsNoLoss = diaryMonthsNoLoss(tanks);
  return {
    totalLogs, water, clean, feed, health, note, onTimeCare,
    tankCount: tanks.length, totalFish, maxVolume, typesUsedCount: typesUsed.size,
    currentStreak: streaks.current, bestStreak: streaks.best, monthsNoLoss,
  };
}

// Возвращает индекс достигнутого тира (-1 если ни одного), прогресс к следующему

export function getBadgeTier(badge, stats) {
  const val = badge.metric(stats);
  let tierIndex = -1;
  for (let i = 0; i < badge.tiers.length; i++) {
    if (val >= badge.tiers[i]) tierIndex = i;
  }
  const maxed = tierIndex === badge.tiers.length - 1;
  const nextTarget = maxed ? badge.tiers[tierIndex] : badge.tiers[tierIndex + 1];
  const prevTarget = tierIndex >= 0 ? badge.tiers[tierIndex] : 0;
  const span = nextTarget - prevTarget || 1;
  const pctToNext = maxed ? 1 : Math.min(Math.max((val - prevTarget) / span, 0), 1);
  return { tierIndex, val, maxed, nextTarget, pctToNext, earned: tierIndex >= 0 };
}


export function diaryEarnedBadgeKeys(stats) {
  // Ключ вида "id:tierIndex" — нужен чтобы ловить именно повышение тира, а не только первое получение
  return DIARY_BADGES.map(b => {
    const { tierIndex } = getBadgeTier(b, stats);
    return tierIndex >= 0 ? `${b.id}:${tierIndex}` : null;
  }).filter(Boolean);
}

// Находит ближайший недостигнутый тир бейджа (минимальное число действий до получения)

export function diaryNearestNextBadge(stats) {
  let best = null;
  DIARY_BADGES.forEach(b => {
    const t = getBadgeTier(b, stats);
    if (t.maxed) return;
    const remaining = Math.max(0, Math.ceil(t.nextTarget - t.val));
    if (remaining <= 0) return;
    if (!best || remaining < best.remaining) {
      best = { badge: b, remaining, ...t };
    }
  });
  return best;
}


export function diaryPluralRu(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}


export function diaryLevelName(level) {
  let name = DIARY_LEVEL_NAMES[0].name;
  for (const l of DIARY_LEVEL_NAMES) if (level >= l.min) name = l.name;
  return name;
}

export function diaryComputeXP(stats) {
  return stats.totalLogs * 10 + stats.water * 5 + stats.clean * 5 + stats.tankCount * 15
    + stats.totalFish * 2 + stats.bestStreak * 8
    + stats.onTimeCare * 8      // бонус за уход ДО просрочки — поощряем своевременность, а не просто клики
    + stats.monthsNoLoss * 20;  // бонус за здоровье коллекции — ни одной потери
}


export async function shareBadgeImage(badge, tierIndex) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    const color = TIER_COLORS[tierIndex] || COLORS.teal;

    const grad = ctx.createLinearGradient(0, 0, 800, 800);
    grad.addColorStop(0, COLORS.bg2);
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    ctx.beginPath();
    ctx.arc(650, 130, 230, 0, Math.PI * 2);
    ctx.fillStyle = color + "22";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.font = "220px sans-serif";
    ctx.fillText(badge.icon, 400, 380);

    ctx.font = "bold 34px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(TIER_NAMES[tierIndex].toUpperCase(), 400, 460);

    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = COLORS.text;
    ctx.fillText(badge.title, 400, 528);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = COLORS.soft;
    wrapCanvasText(ctx, badge.desc || "", 400, 575, 640, 32);

    ctx.font = "28px sans-serif";
    ctx.fillStyle = COLORS.muted;
    ctx.fillText("🐠 AquaMarjon · Дневник ухода", 400, 730);

    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return false;
    const file = new File([blob], `aquamarjon-${badge.id}-${tierIndex}.png`, { type: "image/png" });

    const nav = navigator as any;
    if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      await nav.share({ files: [file], title: badge.title, text: diaryBadgeShareText(badge, tierIndex).text });
      return true;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch {
    return false; // пользователь отменил share-диалог или canvas недоступен — не блокируем UI
  }
}


export function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = w + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

// Генерирует контент поста для шаринга бейджа в Клуб

export function diaryBadgeShareText(badge, tierIndex) {
  return {
    title: `Получил бейдж «${badge.title}» — ${TIER_NAMES[tierIndex]}! 🏅`,
    text: `${badge.icon} ${badge.desc}. Веду дневник ухода в AquaMarjon — присоединяйтесь!`,
    tag: { label: "Достижение", color: TIER_COLORS[tierIndex] },
    photo: { emoji: badge.icon, color: TIER_COLORS[tierIndex] },
  };
}

// Генерирует контент поста для шаринга «выживания» конкретной рыбы

export function diaryFishShareText(fish, tankName, days, tierIndex) {
  return {
    title: `${fish.img} ${fish.name} живёт у меня уже ${days} дней!`,
    text: `Аквариум «${tankName}» · статус «${TIER_NAMES[tierIndex]}» в дневнике ухода AquaMarjon 🐠`,
    tag: { label: "Питомец", color: TIER_COLORS[tierIndex] },
    photo: { emoji: fish.img, color: TIER_COLORS[tierIndex] },
  };
}


export function diaryDaysSince(iso) {
  if (!iso) return 0;
  const d = new Date(iso + "T00:00:00");
  const today = new Date(diaryTodayISO() + "T00:00:00");
  return Math.max(0, Math.round((today.getTime() - d.getTime()) / 86400000));
}

export function getFishSurvivalTier(days) {
  let idx = -1;
  FISH_SURVIVAL_TIERS.forEach((t, i) => { if (days >= t) idx = i; });
  return idx;
}

// Рейтинг сообщества — фиктивные пользователи + текущий пользователь (по реальному XP)

export function diaryBuildLeaderboard(diaryStats) {
  const myXp = diaryStats ? diaryComputeXP(diaryStats) : 0;
  const myLevel = Math.floor(myXp / 100) + 1;
  const rows = [
    ...DIARY_LEADERBOARD_USERS.map(u => ({ ...u, level: Math.floor(u.xp / 100) + 1, isMe: false })),
    { id: "me", name: "Вы", avatar: "🧑‍🚀", city: "—", xp: myXp, level: myLevel, isMe: true },
  ];
  rows.sort((a, b) => b.xp - a.xp);
  return rows;
}


export function diaryUrgency(daysAgo, interval) {
  const pct = daysAgo / interval;
  if (pct >= 1.0) return "overdue";
  if (pct >= 0.75) return "soon";
  return "ok";
}


export const DIARY_TANKS_STORAGE_KEY = "aqua_diary_tanks";

export const DIARY_LAST_OPEN_KEY = "aqua_diary_last_open";

export const DIARY_LAST_INACTIVITY_PUSH_KEY = "aqua_diary_last_inactivity_push";


export function daysSinceISO(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// Удержание: если пользователь давно не открывал дневник, а у какого-то
// аквариума просрочена смена воды/чистка фильтра — шлём пуш не чаще раза в
// день (троттлим через локальную метку времени последней отправки).

export async function maybeSendInactivityReminder(tanks: any[]) {
  const daysSinceOpen = daysSinceISO(readLocal(DIARY_LAST_OPEN_KEY, null));
  if (daysSinceOpen == null || daysSinceOpen < 5) return; // порог — 5 дней без захода
  const lastPush = readLocal(DIARY_LAST_INACTIVITY_PUSH_KEY, null);
  if (lastPush && daysSinceISO(lastPush)! < 1) return; // не чаще раза в день

  const overdueTank = (tanks || []).find(
    (t) => t.lastWaterChange >= t.waterChangeEvery || t.lastFilterClean >= t.filterCleanEvery
  );
  if (!overdueTank) return;

  const reason = overdueTank.lastWaterChange >= overdueTank.waterChangeEvery ? "смена воды" : "чистка фильтра";
  const ok = await notifyTelegram("inactivity_reminder", {
    text: `Вы не заходили ${daysSinceOpen} дн. — у «${overdueTank.name}» просрочена ${reason}`,
    tankName: overdueTank.name, daysAgo: daysSinceOpen, reason,
  });
  if (ok) writeLocal(DIARY_LAST_INACTIVITY_PUSH_KEY, new Date().toISOString());
}

