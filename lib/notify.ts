import { API, logClientError, telegramInitHeaders, tgUser } from "./api";

export type NotifType = "water_reminder" | "order_status" | "new_arrival" | "subscription_due" | "badge_progress" | "inactivity_reminder";


export async function notifyTelegram(type: NotifType, payload: Record<string, any> = {}) {
  if (!tgUser?.id) return false; // вне Telegram WebApp пушить некому
  try {
    const res = await fetch(`${API}/notifications/notify`, {
      method: "POST",
      headers: telegramInitHeaders(),
      body: JSON.stringify({ telegram_id: tgUser.id, type, payload }),
    });
    if (!res.ok) {
      // Бэкенд ответил, но с ошибкой (напр. неверный telegram_id, бот
      // заблокирован пользователем, 5xx) — это не «нет сети», а реальный
      // повод для расследования, поэтому логируем отдельно от catch ниже.
      logClientError("notifyTelegram: non-OK response", new Error(`HTTP ${res.status}`), { type, telegram_id: tgUser.id });
      return false;
    }
    return true;
  } catch (err) {
    // Сюда попадают офлайн/недоступный бэкенд — UI это не блокирует,
    // но факт всё равно логируем, чтобы отличать «никто не пушится» от
    // «пушится, но с ошибками», глядя на логи, а не гадая.
    logClientError("notifyTelegram: request failed", err, { type, telegram_id: tgUser.id, online: typeof navigator !== "undefined" ? navigator.onLine : undefined });
    return false;
  }
}


export type NotifPrefs = { water: boolean; delivery: boolean; arrivals: boolean };

export const DEFAULT_NOTIF_PREFS: NotifPrefs = { water: true, delivery: true, arrivals: true };


export async function syncNotifPrefs(prefs: NotifPrefs) {
  if (!tgUser?.id) return;
  try {
    const res = await fetch(`${API}/notifications/preferences`, {
      method: "POST",
      headers: telegramInitHeaders(),
      body: JSON.stringify({ telegram_id: tgUser.id, prefs }),
    });
    if (!res.ok) {
      logClientError("syncNotifPrefs: non-OK response", new Error(`HTTP ${res.status}`), { telegram_id: tgUser.id, prefs });
    }
  } catch (err) {
    logClientError("syncNotifPrefs: request failed", err, { telegram_id: tgUser.id, prefs, online: typeof navigator !== "undefined" ? navigator.onLine : undefined });
  }
}

/* ============================================================
   🏷️ Промокоды — бэкенд-валидация
   ============================================================ */
