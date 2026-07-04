import { TIER_NAMES } from "../data/diary-content";
import { S } from "./seller-styles";
import { readLocal, writeLocal } from "./storage";

export const ACHIEVEMENT_PROMO_KEY = "aqua_diary_reward_promos";

export const ACHIEVEMENT_PROMO_PERCENTS = [5, 10, 15]; // по тиру: бронза/серебро/золото
// Минимальная сумма заказа для применения награды — растёт вместе с тиром,
// иначе −15% можно слить на самый дешёвый товар в корзине и уйти в минус по марже.

export const ACHIEVEMENT_PROMO_MIN_ORDER = [50000, 150000, 300000]; // сум, по тиру: бронза/серебро/золото


export function diaryAchievementPromoCode(badgeId: string, tierIndex: number): string {
  const tierLetter = ["B", "S", "G"][tierIndex] || "B";
  return `AQUA-${badgeId.toUpperCase().slice(0, 8)}-${tierLetter}`;
}


export function getRewardPromos(): Record<string, { percent: number; label: string; badgeId: string; tierIndex: number; usedAt: string | null; minOrderSum: number }> {
  return readLocal(ACHIEVEMENT_PROMO_KEY, {});
}

// Сохраняет новый промокод-награду за бейдж (если такого ещё нет) и возвращает его

export function unlockAchievementPromo(badge: { id: string; title: string; icon: string }, tierIndex: number) {
  const code = diaryAchievementPromoCode(badge.id, tierIndex);
  const promos = getRewardPromos();
  if (!promos[code]) {
    const percent = ACHIEVEMENT_PROMO_PERCENTS[tierIndex] ?? 5;
    const minOrderSum = ACHIEVEMENT_PROMO_MIN_ORDER[tierIndex] ?? 50000;
    promos[code] = {
      percent,
      label: `${badge.icon} Награда за «${badge.title}» (${TIER_NAMES[tierIndex]})`,
      badgeId: badge.id,
      tierIndex,
      usedAt: null,
      minOrderSum,
    };
    writeLocal(ACHIEVEMENT_PROMO_KEY, promos);
  }
  return { code, ...promos[code] };
}

// Отмечает промокод-награду как использованный — вызывается при успешном
// оформлении заказа, чтобы код нельзя было применить повторно (одноразовость).

export function markRewardPromoUsed(code: string) {
  const key = code.trim().toUpperCase();
  const promos = getRewardPromos();
  if (promos[key] && !promos[key].usedAt) {
    promos[key] = { ...promos[key], usedAt: new Date().toISOString() };
    writeLocal(ACHIEVEMENT_PROMO_KEY, promos);
  }
}

