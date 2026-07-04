import { COLORS } from "../theme";

export const ORDER_STATUSES = [
  { key: "accepted",  label: "Принят",      icon: "✅", desc: "Продавец получил заказ" },
  { key: "packed",    label: "Собирается",  icon: "📦", desc: "Упаковываем рыб в термопакет" },
  { key: "courier",   label: "У курьера",   icon: "🏍️", desc: "Курьер забрал заказ" },
  { key: "way",       label: "В пути",      icon: "🚚", desc: "Едет к вам" },
  { key: "delivered", label: "Доставлен",   icon: "🎉", desc: "Заказ получен" },
];

// Параметры совместимости (упрощённая модель для демо)

export const ORDER_STATUS_FLOW = [
  { key: "new",       label: "Новый",       icon: "🔔", color: COLORS.amber },
  { key: "packed",    label: "Собирается",  icon: "📦", color: COLORS.teal },
  { key: "courier",   label: "У курьера",   icon: "🏍️", color: COLORS.soft },
  { key: "delivered", label: "Доставлен",   icon: "✅", color: COLORS.green },
  { key: "cancelled", label: "Отменён",     icon: "❌", color: COLORS.red },
];


export const NEXT_STATUS = { new: "accepted", accepted: "packed", packed: "courier", courier: "way", way: "delivered" };
