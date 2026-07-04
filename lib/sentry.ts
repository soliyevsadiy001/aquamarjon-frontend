import * as Sentry from "@sentry/react";

/* ------------------------------------------------------------
   🪵 Sentry — инициализация
   DSN не секрет (он предназначен для попадания в клиентский бандл —
   так же, как и токен Telegram WebApp), поэтому просто читаем его из
   VITE_SENTRY_DSN тем же способом, что и VITE_API_URL в api.ts.

   Если переменная не задана (например, локальная разработка без
   .env.local) — Sentry просто не инициализируется, initSentry() no-op,
   и logClientError() в api.ts продолжает работать как раньше
   (только console.error, без сети). Ничего не сломается.
   ------------------------------------------------------------ */

function readSentryDsn(): string | undefined {
  try {
    if (import.meta.env?.VITE_SENTRY_DSN) {
      return import.meta.env.VITE_SENTRY_DSN as string;
    }
  } catch {
    // import.meta недоступен вне ESM-сборщика
  }
  return undefined;
}

function readEnvironment(): string {
  try {
    if (import.meta.env?.MODE) return import.meta.env.MODE as string;
  } catch {
    // ignore
  }
  return "production";
}

let sentryReady = false;

export function initSentry() {
  if (sentryReady) return;
  const dsn = readSentryDsn();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: readEnvironment(),
    // Тот же release id, что vite.config.ts передал в @sentry/vite-plugin
    // при заливке sourcemaps — без совпадения release событие в Sentry не
    // свяжется с загруженными картами, и в стектрейсе снова будет
    // минифицированный мусор вместо реальных файла/строки.
    release: typeof __SENTRY_RELEASE__ !== "undefined" ? __SENTRY_RELEASE__ : undefined,
    // Немного трейсов производительности — этого достаточно для мини-аппа,
    // не стоит писать 100% в проде ради экономии квоты Sentry.
    tracesSampleRate: 0.1,
    // В Telegram WebView часто встречаются шумные, не влияющие на пользователя
    // ошибки от самого WebView/расширений — по умолчанию их не фильтруем,
    // но при необходимости сюда можно добавить ignoreErrors.
  });

  // Привязываем telegram_id как идентификатор пользователя, если доступен —
  // помогает искать все ошибки конкретного пользователя в Sentry при
  // разборе обращения в поддержку.
  try {
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.id) {
      Sentry.setUser({ id: String(tgUser.id), username: tgUser.username });
    }
  } catch {
    // Telegram WebApp недоступен (обычный браузер вне Mini App) — не критично
  }

  sentryReady = true;
}

export function captureClientError(error: unknown, context: string, extra?: Record<string, any>) {
  if (!sentryReady) return;
  const normalized = error instanceof Error ? error : new Error(String(error));
  Sentry.captureException(normalized, { tags: { context }, extra });
}
