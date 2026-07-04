export const SEED_TANKS = [
  {
    id: "t1",
    name: "Гостиная",
    volume: 120,
    fishList: [
      { name: "Гуппи", qty: 5, img: "🐠" },
      { name: "Неон", qty: 12, img: "🐟" },
      { name: "Анциструс", qty: 2, img: "🐡" },
    ],
    lastWaterChange: 5,
  },
  {
    id: "t2",
    name: "Спальня — нано",
    volume: 40,
    fishList: [{ name: "Петушок", qty: 1, img: "👑" }],
    lastWaterChange: 1,
  },
];


export const SEED_ORDERS = [
  {
    id: 4821,
    date: "24 июня",
    items: [
      { name: "Гуппи «Огненный хвост»", img: "🐠", qty: 3, type: "fish" },
      { name: "Корм хлопья «Универсал»", img: "🍽️", qty: 1, type: "food" },
    ],
    total: 93000,
    status: "Доставлен",
  },
  {
    id: 4790,
    date: "10 июня",
    items: [{ name: "Фильтр внутренний «Поток-100»", img: "⚙️", qty: 1, type: "equipment" }],
    total: 65000,
    status: "Доставлен",
  },
];


export const DIARY_SEED_TANKS = [
  {
    id: "dt1", name: "Гостиная", volume: 120, emoji: "🌿",
    careSinceISO: "2026-03-15", // с какой даты ведётся учёт «без потерь»
    lastLossISO: null,          // дата последней гибели рыбы (null = ни одной потери)
    fish: [
      { id: "guppy", name: "Гуппи «Огненный хвост»", qty: 5, img: "🐠", temp: [22,28], lifespan: "3–5 лет", addedDate: "15 мая", status: "alive" },
      { id: "neon",  name: "Неон «Голубая искра»",   qty: 12, img: "🐟", temp: [20,26], lifespan: "4–6 лет", addedDate: "15 мая", status: "alive" },
      { id: "ancistrus", name: "Анциструс «Чистильщик»", qty: 2, img: "🐡", temp: [22,27], lifespan: "8–10 лет", addedDate: "20 мая", status: "alive" },
    ],
    logs: [
      { id: "l1", date: "23 июня", type: "water", note: "Смена 30% воды, добавил кондиционер", temp: 25 },
      { id: "l2", date: "16 июня", type: "water", note: "Плановая смена воды 30%", temp: 26 },
      { id: "l3", date: "10 июня", type: "clean", note: "Почистил стёкла и фильтр", temp: 25 },
      { id: "l4", date: "2 июня",  type: "feed",  note: "Начал давать корм «Цветной бустер»", temp: 25 },
    ],
    waterChangeEvery: 7, lastWaterChange: 5,
    filterCleanEvery: 30, lastFilterClean: 10,
    feedingSchedule: "2 раза в день",
    notes: "Неоны держатся у нижнего слоя — возможно стресс от света.",
    temperature: 25, ph: 7.2, no3: 30, nh4: 0.0,
    treatment: { name: "JBL Ektol crystal", day: 3, totalDays: 7 },
    tasks: [
      { id: "feed_morning", icon: "🍽️", label: "Покормить рыб утром", sub: "Ежедневно", done: true },
      { id: "water_change", icon: "💧", label: "Подменить 20% воды", sub: "Просрочено на 1 день", done: false, overdue: true },
      { id: "clean_glass",  icon: "🧽", label: "Почистить стекло",    sub: "Раз в неделю", done: false },
      { id: "check_filter", icon: "🔧", label: "Проверить фильтр",    sub: "Раз в 2 недели", done: false },
    ],
  },
  {
    id: "dt2", name: "Спальня — нано", volume: 40, emoji: "👑",
    careSinceISO: "2026-02-01",
    lastLossISO: null,
    fish: [
      { id: "betta", name: "Петушок «Королевский бархат»", qty: 1, img: "👑", temp: [24,29], lifespan: "2–4 года", addedDate: "1 июня", status: "alive" },
    ],
    logs: [
      { id: "l5", date: "24 июня", type: "water", note: "Смена 20% воды", temp: 27 },
      { id: "l6", date: "17 июня", type: "water", note: "Смена 20% воды. Петушок активен.", temp: 27 },
    ],
    waterChangeEvery: 7, lastWaterChange: 1,
    filterCleanEvery: 30, lastFilterClean: 20,
    feedingSchedule: "1 раз в день",
    notes: "Петушок реагирует на палец у стекла — узнаёт меня.",
    temperature: 27, ph: 7.0, no3: 10, nh4: 0.0,
    treatment: null,
    tasks: [
      { id: "feed_morning", icon: "🍽️", label: "Покормить петушка", sub: "Ежедневно", done: true },
      { id: "water_change", icon: "💧", label: "Подменить 20% воды", sub: "Раз в неделю", done: false },
    ],
  },
];

