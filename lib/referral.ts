import { unlockAchievementPromo } from "./achievement-promo";
import { readLocal, writeLocal } from "./storage";

export const REFERRAL_BADGE = { id: "referral", title: "Приведи друга", icon: "🤝" };

export const MY_REFERRAL_CODE_KEY = "aqua_my_referral_code";

export const REDEEMED_REFERRALS_KEY = "aqua_redeemed_referral_codes";


export function getMyReferralCode(): string {
  let code = readLocal(MY_REFERRAL_CODE_KEY, null);
  if (!code) {
    code = "FRIEND-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    writeLocal(MY_REFERRAL_CODE_KEY, code);
  }
  return code;
}

// Активирует чужой реферальный код: текущий пользователь получает промокод-награду.
// В реальном бэкенде это также начислило бы промокод владельцу кода — здесь,
// в локальном прототипе без серверных аккаунтов, мы честно показываем это
// в тексте подсказки, а не делаем вид, что наградили и друга тоже.

export function redeemReferralCode(code: string): { ok: boolean; error?: string; reward?: any } {
  const key = code.trim().toUpperCase();
  if (!key) return { ok: false, error: "Введите код друга" };
  if (key === getMyReferralCode()) return { ok: false, error: "Это ваш собственный код" };
  const redeemed = readLocal(REDEEMED_REFERRALS_KEY, []);
  if (redeemed.includes(key)) return { ok: false, error: "Вы уже активировали реферальный код" };
  writeLocal(REDEEMED_REFERRALS_KEY, [...redeemed, key]);
  const reward = unlockAchievementPromo(REFERRAL_BADGE, 1); // тир «серебро» — 10%, от 150 000 сум
  return { ok: true, reward };
}

