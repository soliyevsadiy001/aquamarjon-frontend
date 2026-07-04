export const SUBSCRIPTION_DISCOUNT = 0.1; // 10%

export const SUBSCRIPTION_INTERVALS = [
  { weeks: 2, label: "Каждые 2 недели" },
  { weeks: 4, label: "Каждый месяц" },
  { weeks: 6, label: "Раз в 6 недель" },
];

export function nextDeliveryDate(intervalWeeks) {
  return Date.now() + intervalWeeks * 7 * 24 * 60 * 60 * 1000;
}

export function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

// Единая точка определения «онлайн ли клиент» — используется и баннером наверху
// экрана, и разовым предупреждением на шаге оплаты в Checkout, чтобы не дублировать
// подписку на window online/offline в двух местах и не разъезжаться в логике.
