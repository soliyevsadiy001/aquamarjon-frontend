import type { Account } from "../types";
import { captureClientError } from "./sentry";

export function readEnvApiUrl(): string | undefined {
  // Vite: process.env не определён по умолчанию (в отличие от CRA/Next),
  // зато import.meta.env всегда есть и подставляется на этапе сборки —
  // проверяем его первым. Переменная берётся из .env / .env.local
  // (VITE_API_URL=...) и должна начинаться с VITE_, иначе Vite её не увидит.
  try {
    if (import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch {
    // import.meta недоступен вне ESM-сборщика — используем фолбэк ниже
  }
  try {
    // typeof-проверка обязательна: в браузерном бандле без полифилла `process`
    // просто не существует, и обращение к process.env упадёт в ReferenceError.
    if (typeof process !== "undefined" && process.env) {
      return process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
    }
  } catch {
    // process не определён в этом окружении — используем дефолт ниже
  }
  return undefined;
}

export const API = readEnvApiUrl() || "https://aqua-uz-backend.up.railway.app/api";

// ⚠️ ПЕРЕД ПРОДАКШЕНОМ: offline-фолбэк логина сверяет пароли из INIT_ACCOUNTS
// (см. data/accounts.ts) прямо в клиентском бандле — они видны любому, кто
// откроет devtools. Это нужно только для офлайн-демо без бэкенда.
//
// Раньше флаг был жёстко закодирован как `true` — то есть попадал в продакшен-
// сборку ровно таким же образом, как и в дев-сборку, и его отключение перед
// каждым релизом нужно было не забыть сделать руками. Теперь источник правды —
// переменная окружения VITE_ALLOW_OFFLINE_AUTH_FALLBACK (см. .env.example),
// а дефолт при её отсутствии — `import.meta.env.DEV`: включено только при
// `npm run dev`, и всегда `false` в `vite build` (production), если явно не
// переопределить.
//
// Так что для реального релиза ничего специально выключать не нужно — просто
// не выставляйте VITE_ALLOW_OFFLINE_AUTH_FALLBACK=true в проде. Единственное,
// что всё ещё нужно сделать руками — заменить демо-пароли в data/accounts.ts
// на что-то не являющееся реальными продовыми паролями (см. комментарий там).

function readAllowOfflineAuthFallback(): boolean {
  try {
    const raw = import.meta.env?.VITE_ALLOW_OFFLINE_AUTH_FALLBACK;
    if (raw === "true") return true;
    if (raw === "false") return false;
  } catch {
    // import.meta недоступен вне ESM-сборщика
  }
  try {
    return !!import.meta.env?.DEV;
  } catch {
    return false;
  }
}

export const ALLOW_OFFLINE_AUTH_FALLBACK = readAllowOfflineAuthFallback();

if (ALLOW_OFFLINE_AUTH_FALLBACK) {
  // Специально громкий console.warn (не console.log) — чтобы это было видно
  // и в проде, если флаг всё же случайно включат через env, и в QA перед
  // релизом. См. также OfflineAuthBanner в App.tsx — тот же флаг рисует
  // видимый баннер прямо в интерфейсе, чтобы это нельзя было не заметить.
  // eslint-disable-next-line no-console
  console.warn(
    "[AquaMarjon] ALLOW_OFFLINE_AUTH_FALLBACK включён — пароли из data/accounts.ts " +
    "доступны в клиентском бандле. Это допустимо только для офлайн-демо. " +
    "Перед продакшен-релизом уберите VITE_ALLOW_OFFLINE_AUTH_FALLBACK=true из env."
  );
}

export const tg = (window as any).Telegram?.WebApp;

export const tgInitData: string = tg?.initData || "";

export const tgUser = tg?.initDataUnsafe?.user as { id?: number; first_name?: string; username?: string } | undefined;

// Единый тип роли аккаунта продавца/курьера/админа — раньше "seller"/"courier"/
// "admin" были рассыпаны по файлу как строковые литералы без единого источника
// правды. Теперь опечатку в роли ловит компилятор, а не рантайм.
// Role теперь импортируется из ./types (используется и в Account).

// Все экраны верхнего уровня, между которыми переключается App().
// Раньше это жило только в виде комментария рядом с useState("landing") —
// теперь это настоящий тип: опечатка в названии экрана ловится компилятором,
// а не в рантайме при клике на пустой экран.

export let inMemoryToken: string = "";

export function getToken(): string { return inMemoryToken; }

export function setToken(t: string) { inMemoryToken = t; }

export function clearToken() { inMemoryToken = ""; }

// Базовые заголовки для авторизованных запросов

export function authHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
}

// Заголовок с подписанным Telegram initData — бэкенд теперь проверяет им
// customer-facing ручки (/notifications/*, /promos/validate), которые не
// используют Bearer-токен (покупатели не логинятся через /auth/login).
// См. middleware/telegram.ts на бэкенде. Вне Telegram WebApp (обычный
// браузер, локальная разработка) tgInitData будет пустой строкой — тогда
// бэкенд либо мягко пропустит запрос (если TELEGRAM_BOT_TOKEN не задан),
// либо ответит 401 TELEGRAM_INIT_DATA_REQUIRED (в проде).
export function telegramInitHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", "X-Telegram-Init-Data": tgInitData };
}

/* ------------------------------------------------------------
   🔑 Смена пароля текущим пользователем (после входа по временному
   паролю, см. ChangePasswordScreen). Раньше это нигде не отправлялось
   на бэкенд — пароль менялся только в локальном reducer и терялся при
   следующем логине с другого устройства/после очистки localStorage.
   ------------------------------------------------------------ */

export async function changePasswordRemote(newPassword: string): Promise<void> {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ password: newPassword }),
  });
  if (!res.ok) throw new Error(`changePasswordRemote: ${res.status}`);
}

/* ------------------------------------------------------------
   🔐 Админ: CRUD аккаунтов курьеров/продавцов
   Фронтовая часть переезда с локального state (useAuth) на бэкенд как
   источник правды для accounts — см. предупреждение про
   ALLOW_OFFLINE_AUTH_FALLBACK выше, ради которого это всё затевалось.
   Бэкенду нужны эндпоинты (все — только для роли admin, проверка по
   Bearer-токену из authHeaders(), как и остальные защищённые ручки):
     GET    /admin/accounts                    → Account[]
     POST   /admin/accounts                    { role, name, phone, region, login, password } → Account
     PATCH  /admin/accounts/:id                { field, value } → Account
     POST   /admin/accounts/:id/toggle         → Account
     DELETE /admin/accounts/:id                → 204
     POST   /admin/accounts/:id/reset-password → { tempPass: string }

   ⚠️ ВАЖНО: экран "admin" теперь идёт через свой LoginScreen (role="admin",
   см. renderAdminPanel в App.tsx) — как и у seller/courier, так что
   getToken() к моменту вызова функций ниже будет реально заполнен токеном
   с бэкенда /auth/login. Но пока ALLOW_OFFLINE_AUTH_FALLBACK === true,
   единственный admin-аккаунт (data/accounts.ts) всё ещё проверяется локально
   с паролем открытым текстом в бандле — та же оговорка, что и для
   курьеров/продавцов, только цена компрометации выше (это админ). Перед
   продакшеном обязательно отключить фолбэк или снести этот аккаунт целиком.

   Пока бэкенд не поднял ручки (или пока нет admin-токена) — все функции
   ниже кидают исключение, вызывающий код в useAuth.ts ловит это и остаётся
   на localStorage-фолбэке, так что ничего не ломается прямо сейчас.
   ------------------------------------------------------------ */

export async function adminListAccounts(): Promise<Account[]> {
  const res = await fetch(`${API}/admin/accounts`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`adminListAccounts: ${res.status}`);
  return res.json();
}

export async function adminCreateAccount(
  payload: Pick<Account, "role" | "name" | "phone" | "region" | "login" | "password">
): Promise<Account> {
  const res = await fetch(`${API}/admin/accounts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`adminCreateAccount: ${res.status}`);
  return res.json();
}

export async function adminUpdateAccount(id: string, field: string, value: unknown): Promise<Account> {
  const res = await fetch(`${API}/admin/accounts/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ field, value }),
  });
  if (!res.ok) throw new Error(`adminUpdateAccount: ${res.status}`);
  return res.json();
}

export async function adminToggleAccount(id: string): Promise<Account> {
  const res = await fetch(`${API}/admin/accounts/${id}/toggle`, { method: "POST", headers: authHeaders() });
  if (!res.ok) throw new Error(`adminToggleAccount: ${res.status}`);
  return res.json();
}

export async function adminDeleteAccount(id: string): Promise<void> {
  const res = await fetch(`${API}/admin/accounts/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error(`adminDeleteAccount: ${res.status}`);
}

export async function adminResetPassword(id: string): Promise<string> {
  const res = await fetch(`${API}/admin/accounts/${id}/reset-password`, { method: "POST", headers: authHeaders() });
  if (!res.ok) throw new Error(`adminResetPassword: ${res.status}`);
  const data = await res.json();
  return data.tempPass as string;
}

/* ------------------------------------------------------------
   📦 Заказы (админка / продавец / курьер)
   Раньше AdminOrdersTab, SellerCabinet и CourierView не знали о заказах,
   реально попавших в БД через POST /orders (см. lib/orders-map.ts —
   там же лежит функция, которая раскладывает ответ под конкретный
   экран). Доступ на бэкенде зависит от роли из Bearer-токена:
     admin/seller — видят все заказы;
     courier      — только те, что назначены на него (по имени).
   ------------------------------------------------------------ */

export async function listOrders(): Promise<import("./orders-map").BackendOrder[]> {
  const res = await fetch(`${API}/orders`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`listOrders: ${res.status}`);
  return res.json();
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<import("./orders-map").BackendOrder> {
  const res = await fetch(`${API}/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`updateOrderStatus: ${res.status}`);
  return res.json();
}

export async function updateOrderNote(id: string, note: string): Promise<import("./orders-map").BackendOrder> {
  const res = await fetch(`${API}/orders/${id}/note`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error(`updateOrderNote: ${res.status}`);
  return res.json();
}

export async function assignOrderCourier(
  id: string,
  courierName: string
): Promise<import("./orders-map").BackendOrder> {
  const res = await fetch(`${API}/orders/${id}/assign-courier`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ courierName }),
  });
  if (!res.ok) throw new Error(`assignOrderCourier: ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------
   🤖 AI-прокси (чат-бот Marjon и AI-диагностика в Докторе)
   ⚠️ ВАЖНО: раньше AIChatWidget и DocStepDiagnosis дёргали
   https://api.anthropic.com/v1/messages прямо с фронта, без ключа —
   т.е. в проде это просто падало (401 / CORS не пустит браузер напрямую).
   А если бы ключ туда добавили — он бы утёк в клиентский бандл точно
   так же, как Telegram-токен бота в ContactSupportScreen. Секретный
   ANTHROPIC_API_KEY должен жить только на бэкенде.
   Бэкенду нужно поднять два тонких эндпоинта-обёртки над Anthropic
   Messages API (ключ берётся из env, не из запроса):
     POST /ai/chat     { system, messages } → { text }
     POST /ai/diagnose { system, messages } → { text }
   Пока бэкенд их не реализовал, вызовы ниже будут падать в catch —
   экраны уже показывают пользователю понятную ошибку ("нет соединения" /
   "проверьте соединение"), так что поведение не хуже текущего.
   ------------------------------------------------------------ */

async function callAiProxy(endpoint: "chat" | "diagnose", system: string, messages: unknown[]): Promise<string> {
  const res = await fetch(`${API}/ai/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error(`AI ${endpoint} proxy error: ${res.status}`);
  const data = await res.json();
  // Бэкенд может отдать либо готовый { text }, либо сырой ответ Anthropic
  // ({ content: [{ text }] }) — поддерживаем оба формата на всякий случай.
  if (typeof data.text === "string") return data.text;
  if (Array.isArray(data.content)) return data.content.map((b: any) => b.text || "").join("");
  return "";
}

export function aiChat(system: string, userMessage: string): Promise<string> {
  return callAiProxy("chat", system, [{ role: "user", content: userMessage }]);
}

export function aiDiagnose(system: string, messages: unknown[]): Promise<string> {
  return callAiProxy("diagnose", system, messages);
}

/* ------------------------------------------------------------
   📩 Заявка «Нет доступа» (ContactSupportScreen)
   ⚠️ Раньше здесь прямо с фронта звался Telegram Bot API с токеном бота
   в URL — токен был виден любому в devtools/Network, т.е. фактически
   публичный, и им можно было слать сообщения от имени бота / читать
   апдейты / менять webhook. Токен уже был в бандле — его нужно отозвать
   у @BotFather и выпустить новый, который будет жить только в env бэкенда.
   Бэкенду нужен эндпоинт:
     POST /support/request { role, name, username, userId, message } → 200
   (тонкая обёртка: бэк сам зовёт api.telegram.org/bot<TOKEN>/sendMessage).
   ------------------------------------------------------------ */

export async function submitSupportRequest(payload: {
  role: string;
  name: string;
  username: string;
  userId: string | number;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API}/support/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Support request error: ${res.status}`);
}

/* ------------------------------------------------------------
   🪵 Логирование клиентских ошибок
   Единая точка вместо разрозненных `catch {}` по всему файлу —
   пишет в console.error со структурным контекстом (что упало,
   с какими параметрами), чтобы это было видно в devtools или
   логах Telegram WebView, И отправляет ошибку в Sentry (см. lib/sentry.ts),
   так что о проблемах у реальных пользователей теперь узнаём не только
   если они сами напишут в поддержку. Если VITE_SENTRY_DSN не задан
   (например, локальная разработка), captureClientError() — no-op,
   остаётся только console.error, как и раньше.
   ------------------------------------------------------------ */

export function logClientError(context: string, error: unknown, extra?: Record<string, any>) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[AquaMarjon] ${context}:`, message, extra || "");
  captureClientError(error, context, extra);
}

/* ------------------------------------------------------------
   Push-уведомления через Telegram Bot API
   Реальная отправка сообщения происходит на бэкенде (через
   bot.sendMessage по telegram_id) — фронтенд лишь сообщает
   бэкенду «отправь это событие» и хранит/синхронизирует
   пользовательские настройки уведомлений.
   ------------------------------------------------------------ */
