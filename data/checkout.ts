export const TIME_SLOTS = [
  { id: "morning", label: "Утро",  sub: "9:00–12:00",  icon: "🌅", closeHour: 9  },
  { id: "day",     label: "День",  sub: "12:00–17:00", icon: "☀️", closeHour: 12 },
  { id: "evening", label: "Вечер", sub: "17:00–21:00", icon: "🌙", closeHour: 17 },
];

export const PAY_METHODS = [
  { id: "cash",  label: "Наличными курьеру", sub: "При получении заказа",      icon: "💵" },
  { id: "click", label: "Click",             sub: "Быстрая оплата по QR-коду", icon: "🟦" },
  { id: "payme", label: "Payme",             sub: "Карта Uzcard или Humo",     icon: "🟢" },
];
// ⚠️ Используется как офлайн-фолбэк в legacyPromoFallback() (см. начало файла),
// если бэкенд /api/promos/validate недоступен. НЕ мёртвый код — не удалять
// без необходимости. Удалить можно после того как бэкенд гарантированно стабилен.

export const CHECKOUT_PROMOS = { "AQUA10": 10, "FISH20": 20, "NEWFISH": 15 };

export const SAVED_ADDRESSES = [
  "ул. Навои 12, кв. 34, Ташкент",
  "пр. Мустакиллик 88, офис 5",
];

export const UPSELL = [
  { id: "food-flakes", name: "Корм «Универсал»",       price: 18000, img: "🍽️", reason: "Подходит для рыб в вашем заказе" },
  { id: "heater",      name: "Обогреватель с термост.", price: 65000, img: "🌡️", reason: "Рекомендуется для гуппи и неонов" },
  { id: "plant-moss",  name: "Яванский мох",            price: 14000, img: "🌿", reason: "Укрытие для мальков" },
];
