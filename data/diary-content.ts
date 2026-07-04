import { COLORS } from "../theme";

export const DIARY_LOG_TYPES = [
  { id: "water",  icon: "💧", label: "Смена воды",  color: COLORS.teal },
  { id: "clean",  icon: "🧹", label: "Чистка",       color: COLORS.amber },
  { id: "feed",   icon: "🍽️", label: "Кормление",   color: COLORS.green },
  { id: "health", icon: "🩺", label: "Здоровье",     color: "#F86B6B" },
  { id: "note",   icon: "📝", label: "Заметка",      color: COLORS.soft },
];

/* ============================================================
   🏅 ГЕЙМИФИКАЦИЯ ДНЕВНИКА — стрики, уровни с названиями, тиры бейджей
   ============================================================ */

export const RU_MONTHS_GEN = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

export const TIER_NAMES = ["Бронза", "Серебро", "Золото"];

export const TIER_COLORS = ["#CD7F32", "#C0C8D2", "#FFD24A"];

// Каждый бейдж имеет 3 порога (бронза/серебро/золото)

export const DIARY_BADGES = [
  { id: "streak",      icon: "🔥", title: "Серия ухода",          desc: "Дней подряд с записью в дневнике",   metric: (s) => s.bestStreak,     tiers: [3, 7, 30] },
  { id: "punctual",    icon: "⏱️", title: "Пунктуальность",       desc: "Уход выполнен вовремя (до просрочки)", metric: (s) => s.onTimeCare,   tiers: [5, 15, 40] },
  { id: "water_master",icon: "💧", title: "Мастер воды",          desc: "Смен воды",                          metric: (s) => s.water,          tiers: [10, 30, 100] },
  { id: "clean_freak", icon: "🧹", title: "Чистюля",              desc: "Чисток стёкол и фильтра",            metric: (s) => s.clean,          tiers: [5, 15, 50] },
  { id: "feeder",      icon: "🍽️", title: "Кормилец",             desc: "Записей о кормлении",                metric: (s) => s.feed,           tiers: [5, 20, 60] },
  { id: "vet",         icon: "🩺", title: "Аквариумный врач",     desc: "Записей о здоровье рыб",             metric: (s) => s.health,         tiers: [3, 10, 25] },
  { id: "marathoner",  icon: "📔", title: "Марафонец дневника",   desc: "Записей всего",                      metric: (s) => s.totalLogs,      tiers: [20, 75, 200] },
  { id: "collector",   icon: "🐠", title: "Коллекционер",         desc: "Рыб в коллекции",                    metric: (s) => s.totalFish,      tiers: [15, 40, 100] },
  { id: "keeper",      icon: "🏠", title: "Хранитель аквариумов", desc: "Аквариумов в дневнике",              metric: (s) => s.tankCount,      tiers: [2, 4, 7] },
  { id: "big_house",   icon: "🪸", title: "Большой дом",          desc: "Объём крупнейшего аквариума (л)",    metric: (s) => s.maxVolume,      tiers: [100, 150, 250] },
  { id: "versatile",   icon: "🌈", title: "Разносторонний уход",  desc: "Типов записей использовано",         metric: (s) => s.typesUsedCount, tiers: [3, 4, 5] },
  { id: "guardian",    icon: "🛡️", title: "Хранитель жизни",      desc: "Месяцев подряд без потери ни одной рыбы", metric: (s) => s.monthsNoLoss, tiers: [1, 3, 6] },
];

// Считает, сколько месяцев подряд во всех аквариумах не погибало ни одной рыбы.
// «Слабым звеном» считается аквариум с самой недавней потерей (или началом учёта).

export const DIARY_LEVEL_NAMES = [
  { min: 1,  name: "Новичок" },
  { min: 3,  name: "Любитель" },
  { min: 6,  name: "Опытный аквариумист" },
  { min: 10, name: "Мастер" },
  { min: 15, name: "Гуру" },
];

export const FISH_SURVIVAL_TIERS = [30, 100, 365];

export const DIARY_LEADERBOARD_USERS = [
  { id: "u1", name: "Aziz_Breeder",           avatar: "🧑‍🦱", city: "Ташкент",    xp: 940 },
  { id: "u2", name: "Malika_T",               avatar: "👩",   city: "Самарканд",  xp: 780 },
  { id: "u3", name: "PlantLover_Samarkand",   avatar: "🌿",   city: "Самарканд",  xp: 615 },
  { id: "u4", name: "Rustam_Nukus",           avatar: "🐠",   city: "Нукус",      xp: 540 },
  { id: "u5", name: "Тимур",                  avatar: "📍",   city: "Ташкент",    xp: 410 },
  { id: "u6", name: "Dilnoza_Aqua",           avatar: "👩‍🦰", city: "Фергана",    xp: 295 },
  { id: "u7", name: "Jasur_K",                avatar: "🧔",   city: "Андижан",    xp: 150 },
];
