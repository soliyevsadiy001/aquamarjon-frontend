import { COLORS } from "../theme";

export const SELLER_INITIAL_PRODUCTS = [
  { id: "sp1", name: "Гуппи «Огненный хвост»", emoji: "🐠", tone: COLORS.amber, price: 25000, qty: 12, active: true, views: 48, orders: 7, category: "fish" },
  { id: "sp2", name: "Неон «Голубая искра»", emoji: "🐟", tone: COLORS.teal, price: 8000, qty: 30, active: true, views: 112, orders: 18, category: "fish" },
  { id: "sp3", name: "Анциструс «Чистильщик»", emoji: "🐡", tone: COLORS.teal, price: 20000, qty: 5, active: true, views: 19, orders: 3, category: "fish" },
  { id: "sp4", name: "Корм хлопья «Универсал»", emoji: "🍽️", tone: COLORS.muted, price: 18000, qty: 20, active: false, views: 8, orders: 1, category: "food" },
];


export const SELLER_INITIAL_ORDERS = [
  { id: 4201, date: "27 июня", buyer: "Анвар Т.", region: "Ташкент", items: ["Гуппи ×3", "Неон ×6"], total: 123000, status: "new", address: "ул. Амира Темура, 15, кв. 7" },
  { id: 4198, date: "26 июня", buyer: "Малика Р.", region: "Ташкент", items: ["Анциструс ×1"], total: 45000, status: "packed", address: "ул. Навои, 38" },
  { id: 4187, date: "25 июня", buyer: "Ботир С.", region: "Самарканд", items: ["Неон ×10", "Корм ×1"], total: 178000, status: "delivered", address: "ул. Регистан, 5" },
  { id: 4174, date: "23 июня", buyer: "Зарина К.", region: "Андижан", items: ["Гуппи ×2"], total: 95000, status: "delivered", address: "ул. Бабура, 12" },
];

