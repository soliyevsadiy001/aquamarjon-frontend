import type { Account, Fish } from "../types";

// ⚠️ Пароли ниже — НЕ настоящие продовые секреты (никогда ими и не были —
// это тестовые данные проекта), но лежат открытым текстом в клиентском
// бандле, потому что нужны офлайн-фолбэку логина (см. ALLOW_OFFLINE_AUTH_FALLBACK
// в lib/api.ts). С июля 2026 этот фолбэк по умолчанию выключен в production-
// сборке (`vite build`) и включён только при `npm run dev` — см. комментарий
// там же. То есть эти пароли больше не попадают в бандл, который получают
// реальные пользователи, если явно не выставить
// VITE_ALLOW_OFFLINE_AUTH_FALLBACK=true в проде.
//
// Тем не менее: если у сервиса когда-либо были реальные учётки с такими же
// логинами и такими же паролями на бэкенде — их нужно сменить, т.к. эта
// заглушка могла раньше уходить в прод-бандл (флаг был `true` жёстко).
// Единственный по-настоящему безопасный вариант на будущее — вообще не
// хранить пароли на клиенте: как только /admin/accounts и /auth/login
// на бэкенде подняты и стабильны, этот файл и весь офлайн-фолбэк в
// useAuth.ts/LoginScreen.tsx можно удалить целиком.
export const INIT_ACCOUNTS: Account[] = [
  // Админ — единственный аккаунт с role: "admin".
  { id: "adm_root",  role: "admin",   name: "Администратор", phone: "—", region: "Ташкент", login: "admin", password: "demo-only-AQ9034mn", active: true, lastLogin: "—", tempPass: null },
  // Курьеры
  { id: "c_aziz",   role: "courier", name: "Азиз Р.",    phone: "+998 90 100 11 22", region: "Ташкент",   login: "aziz_courier",   password: "demo-only-AZ1234", active: true,  lastLogin: "28.06 · 09:14", tempPass: null },
  { id: "c_bobur",  role: "courier", name: "Бобур Х.",   phone: "+998 91 200 22 33", region: "Самарканд", login: "bobur_samark",   password: "demo-only-BB5678", active: true,  lastLogin: "27.06 · 18:40", tempPass: null },
  { id: "c_farid",  role: "courier", name: "Фарид М.",   phone: "+998 93 300 33 44", region: "Андижан",   login: "farid_andijan",  password: "demo-only-FR9012", active: true,  lastLogin: "26.06 · 12:05", tempPass: null },
  { id: "c_sanjar", role: "courier", name: "Санжар К.",  phone: "+998 94 400 44 55", region: "Бухара",    login: "sanjar_buxoro",  password: "demo-only-SJ3456", active: false, lastLogin: "20.06 · 08:00", tempPass: null },
  { id: "c_jasur",  role: "courier", name: "Жасур Н.",   phone: "+998 90 500 55 66", region: "Наманган",  login: "jasur_namangan", password: "demo-only-JN7890", active: true,  lastLogin: "28.06 · 11:30", tempPass: null },
  // Продавцы
  { id: "s_ali",    role: "seller",  name: "Али Маркет", phone: "+998 71 100 10 10", region: "Ташкент",   login: "ali_aqua",       password: "demo-only-AL1122", active: true,  lastLogin: "28.06 · 14:02", tempPass: null },
  { id: "s_mira",   role: "seller",  name: "Мира Fish",  phone: "+998 90 200 20 20", region: "Самарканд", login: "mira_fish",      password: "demo-only-MF3344", active: true,  lastLogin: "27.06 · 16:18", tempPass: null },
  { id: "s_tech",   role: "seller",  name: "AquaTech",   phone: "+998 93 300 30 30", region: "Ташкент",   login: "aquatech_uz",    password: "demo-only-AT5566", active: false, lastLogin: "15.06 · 09:00", tempPass: null },
];

// ── Экран «Свяжитесь с нами» для новых курьеров/продавцов ────
