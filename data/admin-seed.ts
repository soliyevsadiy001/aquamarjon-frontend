import { COLORS } from "../theme";
import { DELIVERY_RATES } from "./regions";

export const ADMIN_INIT_ORDERS = [
  { id: 4821, buyer: "Анвар Т.", phone: "+998 90 111 22 33", region: "Ташкент", address: "ул. Амира Темура, 15, кв. 7", total: 93000,  status: "way",       items: [{ name: "Гуппи ×3", price: 75000 }, { name: "Корм «Универсал»", price: 18000 }], time: "14:32", date: "28.06", courier: "Азиз Р.",   note: "" },
  { id: 4820, buyer: "Малика Р.", phone: "+998 91 222 33 44", region: "Самарканд", address: "ул. Регистан, 7", total: 280000, status: "packed",    items: [{ name: "Дискус ×1", price: 180000 }, { name: "Фильтр Pro", price: 100000 }], time: "14:10", date: "28.06", courier: "Бобур Х.",  note: "Позвонить за час" },
  { id: 4819, buyer: "Ботир С.",  phone: "+998 93 333 44 55", region: "Ташкент",   address: "пр. Мустакиллик, 22", total: 45000,  status: "accepted",  items: [{ name: "Молли ×5", price: 45000 }], time: "13:54", date: "28.06", courier: "",          note: "" },
  { id: 4818, buyer: "Гулноза Х.", phone: "+998 94 444 55 66", region: "Андижан",  address: "ул. Бабура, 12", total: 165000, status: "delivered",  items: [{ name: "Скалярия ×2", price: 110000 }, { name: "Корм «Цвет»", price: 24000 }, { name: "Анубиас Нана", price: 22000 }], time: "10:20", date: "27.06", courier: "Фарид М.", note: "" },
  { id: 4817, buyer: "Шерзод А.", phone: "+998 90 555 66 77",  region: "Бухара",   address: "ул. Накшбанд, 3", total: 220000, status: "courier",    items: [{ name: "Фильтр «Поток-300 Pro»", price: 220000 }], time: "11:45", date: "27.06", courier: "Санжар К.", note: "" },
  { id: 4816, buyer: "Зарина К.", phone: "+998 91 666 77 88",  region: "Наманган", address: "ул. Навои, 55", total: 56000,  status: "cancelled",  items: [{ name: "Петушок ×1", price: 45000 }, { name: "Корм «Сомик»", price: 16000 }], time: "09:00", date: "27.06", courier: "", note: "Клиент отменил" },
  { id: 4815, buyer: "Тимур Б.",  phone: "+998 93 777 88 99",  region: "Ташкент",  address: "ул. Чилонзор, 8", total: 385000, status: "delivered",  items: [{ name: "Дискус ×2", price: 360000 }, { name: "Мотыль", price: 12000 }], time: "16:00", date: "26.06", courier: "Азиз Р.", note: "" },
];


export const ADMIN_INIT_PRODUCTS = [
  { id: "guppy",       name: "Гуппи «Огненный хвост»", emoji: "🐠", cat: "fish",      price: 25000,  stock: 8,  active: true,  views: 48,  orders: 47, minPrice: 15000 },
  { id: "neon",        name: "Неон «Голубая искра»",    emoji: "🐟", cat: "fish",      price: 8000,   stock: 2,  active: true,  views: 112, orders: 112, minPrice: 5000 },
  { id: "betta",       name: "Петушок «Королевский»",   emoji: "👑", cat: "fish",      price: 45000,  stock: 5,  active: true,  views: 89,  orders: 31, minPrice: 30000 },
  { id: "discus",      name: "Дискус «Королевский»",    emoji: "👑", cat: "fish",      price: 180000, stock: 1,  active: true,  views: 34,  orders: 8,  minPrice: 150000 },
  { id: "danio",       name: "Данио «Зебра»",           emoji: "🐟", cat: "fish",      price: 7000,   stock: 24, active: true,  views: 67,  orders: 64, minPrice: 4000 },
  { id: "angelfish",   name: "Скалярия «Серебряный»",   emoji: "🦈", cat: "fish",      price: 55000,  stock: 3,  active: true,  views: 22,  orders: 22, minPrice: 40000 },
  { id: "filter-ext",  name: "Фильтр «Поток-300 Pro»",  emoji: "⚙️", cat: "equipment", price: 220000, stock: 4,  active: true,  views: 12,  orders: 12, minPrice: 180000 },
  { id: "food-flakes", name: "Корм хлопья «Универсал»", emoji: "🍽️", cat: "food",      price: 18000,  stock: 20, active: true,  views: 67,  orders: 67, minPrice: 12000 },
  { id: "plant-anub",  name: "Анубиас Нана",            emoji: "🌿", cat: "plant",     price: 22000,  stock: 7,  active: true,  views: 26,  orders: 26, minPrice: 15000 },
  { id: "molly",       name: "Молли «Чёрный бархат»",   emoji: "🐟", cat: "fish",      price: 18000,  stock: 0,  active: false, views: 27,  orders: 27, minPrice: 12000 },
];


export const ADMIN_INIT_COURIERS = Object.entries(DELIVERY_RATES).map(([city, d]) => ({
  id: city, name: d.courier, phone: d.phone, region: city,
  rating: d.rating, trips: d.trips, online: [true, true, false, true, true, true, false, true, true, false, true, false][Object.keys(DELIVERY_RATES).indexOf(city)] ?? true,
  rate: d.price, blocked: false,
}));


export const ADMIN_INIT_PROMOS = [
  { code: "AQUA10",  discount: 10, uses: 24, maxUses: 100, active: true,  expires: "31.07.2025" },
  { code: "FISH20",  discount: 20, uses: 8,  maxUses: 50,  active: true,  expires: "15.07.2025" },
  { code: "NEWFISH", discount: 15, uses: 41, maxUses: 200, active: true,  expires: "31.12.2025" },
  { code: "SUMMER30",discount: 30, uses: 3,  maxUses: 30,  active: false, expires: "30.06.2025" },
];


export const ADMIN_INIT_SETTINGS = {
  storeOpen: true,
  smsNotify: true,
  aiDoctor: true,
  courierSignup: false,
  autoAssignCourier: true,
  minOrderFree: 0,
  cashPayment: true,
  clickPayment: true,
  paymePayment: true,
  guaranteeHours: 48,
  supportPhone: "+998 71 200 01 01",
  supportHours: "08:00 – 22:00",
};


export const ADMIN_SC = {
  new:       { label: "Новый",      color: COLORS.amber, bg: "#2A1800" },
  accepted:  { label: "Принят",     color: COLORS.soft, bg: COLORS.border },
  packed:    { label: "Собирается", color: COLORS.amber, bg: "#2A2210" },
  courier:   { label: "У курьера",  color: COLORS.teal, bg: COLORS.greenBg },
  way:       { label: "В пути",     color: "#4DE8D5", bg: "#0A2520" },
  delivered: { label: "Доставлен",  color: COLORS.green, bg: "#0A2010" },
  cancelled: { label: "Отменён",    color: COLORS.red, bg: COLORS.redBg },
};
