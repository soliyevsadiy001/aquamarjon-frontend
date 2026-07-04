import { CHECKOUT_PROMOS } from "../data/checkout";
import { getRewardPromos } from "./achievement-promo";
import { API, telegramInitHeaders } from "./api";

export type PromoType = "percent" | "fixed" | "free_delivery";


export interface PromoResult {
  code: string;
  type: PromoType;
  value: number;
  label: string;
}


export function calcPromoSavings(
  result: PromoResult | null,
  subtotal: number,
  baseDelivery: number,
): { discount: number; delivery: number } {
  if (!result) return { discount: 0, delivery: baseDelivery };
  switch (result.type) {
    case "percent":
      return { discount: Math.round(subtotal * result.value / 100), delivery: baseDelivery };
    case "fixed":
      return { discount: Math.min(result.value, subtotal), delivery: baseDelivery };
    case "free_delivery":
      return { discount: 0, delivery: 0 };
    default:
      return { discount: 0, delivery: baseDelivery };
  }
}


export function promoErrorMessage(serverError: string): string {
  switch (serverError) {
    case "PROMO_NOT_FOUND":      return "Промокод не найден";
    case "PROMO_EXPIRED":        return "Срок действия промокода истёк";
    case "PROMO_USED":           return "Промокод уже использован";
    case "PROMO_LIMIT_REACHED":  return "Промокод больше не действует (лимит исчерпан)";
    case "PROMO_MIN_ORDER":      return "Сумма заказа слишком мала для этого промокода";
    case "PROMO_WRONG_SEGMENT":  return "Этот промокод недоступен для вашего аккаунта";
    default:                     return "Не удалось применить промокод — попробуйте позже";
  }
}

// Старые локальные промокоды (AQUA10 / FISH20 / NEWFISH, см. CHECKOUT_PROMOS ниже
// по файлу) — используются только как офлайн-фолбэк, если бэкенд недоступен
// (упала сеть/таймаут/5xx). Когда бэкенд гарантированно жив — этот блок можно убрать.

export function legacyPromoFallback(key: string, subtotal: number): { result?: PromoResult; error?: string } {
  const percent = (CHECKOUT_PROMOS as Record<string, number>)[key];
  if (percent == null) return { error: "Промокод не найден" };
  return {
    result: {
      code: key,
      type: "percent",
      value: percent,
      label: `−${percent}% (офлайн-режим)`,
    },
  };
}

/* ------------------------------------------------------------
   🎁 Промокоды-награды за достижения дневника
   Реальная мотивация: разблокированный бейдж дневника даёт
   рабочий промокод в магазине (а не просто виртуальную плашку).
   Храним их локально — это персональные награды пользователя,
   а не серверные акции, поэтому проверяем их ДО похода в бэкенд.
   ------------------------------------------------------------ */
/* ------------------------------------------------------------
   🤝 Реферальная программа — «Пригласи друга, оба получите промокод».
   Переиспользует тот же движок наград, что и бейджи дневника
   (unlockAchievementPromo/getRewardPromos), просто под виртуальным
   «бейджем» referral — единая система хранения, единая проверка
   usedAt/minOrderSum при оплате.
   ------------------------------------------------------------ */

export async function applyPromoImpl(
  code: string,
  subtotal: number,
  userId: number | undefined,
  signal: AbortSignal,
  // ⚠️ Позиции корзины (id/price/qty) — бэкенд пересчитывает по ним cart_total
  // из своего каталога, а не доверяет голому subtotal, присланному отсюда
  // (см. requireTelegramInitData + пересчёт в routes/promos.ts). Необязательный
  // параметр ради обратной совместимости — без него бэкенд просто использует
  // старое поведение (доверяет cart_total).
  cartItems?: Array<{ id: string; price: number; qty: number }>,
): Promise<{ result?: PromoResult; error?: string }> {
  const key = code.trim().toUpperCase();
  if (!key) return { error: "Введите промокод" };

  // Сначала проверяем личные промокоды-награды за достижения дневника —
  // они не существуют на бэкенде, поэтому их нужно ловить раньше сетевого запроса.
  const rewardPromos = getRewardPromos();
  if (rewardPromos[key]) {
    const r = rewardPromos[key];
    if (r.usedAt) {
      return { error: promoErrorMessage("PROMO_USED") };
    }
    if (r.minOrderSum && subtotal < r.minOrderSum) {
      return { error: `Минимальная сумма заказа для этого промокода — ${r.minOrderSum.toLocaleString("ru-RU")} сум` };
    }
    return {
      result: {
        code: key,
        type: "percent",
        value: r.percent,
        label: `−${r.percent}% · награда за достижение 🏅`,
      },
    };
  }

  let res: Response;
  try {
    res = await fetch(`${API}/promos/validate`, {
      method: "POST",
      headers: telegramInitHeaders(),
      body: JSON.stringify({ code: key, cart_total: subtotal, user_id: userId, items: cartItems }),
      signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") throw e;
    // Сеть недоступна — пробуем старый локальный список промокодов,
    // чтобы не ломать чекаут.
    return legacyPromoFallback(key, subtotal);
  }

  if (!res.ok) {
    // Бэкенд ответил, но с ошибкой 5xx (а не «промокод неверный») — тоже
    // пробуем офлайн-фолбэк перед тем как сдаться.
    if (res.status >= 500) return legacyPromoFallback(key, subtotal);
    const data = await res.json().catch(() => ({}));
    return { error: promoErrorMessage(data.error || "") };
  }

  const data = await res.json();
  const type: PromoType = data.type;
  const value: number = data.value ?? 0;
  let label: string;
  switch (type) {
    case "percent":        label = `−${value}%`; break;
    case "fixed":          label = `−${value.toLocaleString("ru-RU")} сум`; break;
    case "free_delivery":  label = "Доставка бесплатно 🚚"; break;
    default:                label = "Скидка применена";
  }
  return { result: { code: key, type, value, label } };
}

