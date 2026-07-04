import { describe, expect, it } from "vitest";
import { calcPromoSavings, promoErrorMessage } from "./promo";
import type { PromoResult } from "./promo";

describe("calcPromoSavings", () => {
  const baseDelivery = 25000;
  const subtotal = 200000;

  it("без промокода не даёт скидки и не трогает доставку", () => {
    expect(calcPromoSavings(null, subtotal, baseDelivery)).toEqual({
      discount: 0,
      delivery: baseDelivery,
    });
  });

  it("percent: считает процент от суммы заказа и округляет", () => {
    const promo: PromoResult = { code: "AQUA10", type: "percent", value: 10, label: "" };
    const result = calcPromoSavings(promo, subtotal, baseDelivery);
    expect(result.discount).toBe(20000);
    expect(result.delivery).toBe(baseDelivery);
  });

  it("percent: округляет до целого сума (не оставляет копейки/дробные суммы)", () => {
    const promo: PromoResult = { code: "P", type: "percent", value: 15, label: "" };
    // 100001 * 0.15 = 15000.15 → должно округлиться до 15000
    const result = calcPromoSavings(promo, 100001, baseDelivery);
    expect(result.discount).toBe(15000);
  });

  it("fixed: не может дать скидку больше суммы заказа", () => {
    const promo: PromoResult = { code: "BIG", type: "fixed", value: 999999, label: "" };
    const result = calcPromoSavings(promo, subtotal, baseDelivery);
    expect(result.discount).toBe(subtotal); // скидка не больше subtotal
    expect(result.delivery).toBe(baseDelivery); // доставка не затронута
  });

  it("fixed: обычная скидка меньше суммы заказа применяется как есть", () => {
    const promo: PromoResult = { code: "FIX", type: "fixed", value: 15000, label: "" };
    const result = calcPromoSavings(promo, subtotal, baseDelivery);
    expect(result.discount).toBe(15000);
  });

  it("free_delivery: обнуляет доставку, но не даёт скидку на товары", () => {
    const promo: PromoResult = { code: "FREESHIP", type: "free_delivery", value: 0, label: "" };
    const result = calcPromoSavings(promo, subtotal, baseDelivery);
    expect(result.discount).toBe(0);
    expect(result.delivery).toBe(0);
  });
});

describe("promoErrorMessage", () => {
  it("переводит известные коды ошибок бэкенда в понятный текст", () => {
    expect(promoErrorMessage("PROMO_NOT_FOUND")).toBe("Промокод не найден");
    expect(promoErrorMessage("PROMO_EXPIRED")).toBe("Срок действия промокода истёк");
    expect(promoErrorMessage("PROMO_USED")).toBe("Промокод уже использован");
    expect(promoErrorMessage("PROMO_LIMIT_REACHED")).toContain("лимит");
    expect(promoErrorMessage("PROMO_MIN_ORDER")).toContain("Сумма заказа");
    expect(promoErrorMessage("PROMO_WRONG_SEGMENT")).toContain("недоступен");
  });

  it("для незнакомого кода возвращает общий фолбэк, а не пробрасывает как есть", () => {
    expect(promoErrorMessage("SOME_NEW_BACKEND_ERROR_CODE")).toBe(
      "Не удалось применить промокод — попробуйте позже"
    );
  });
});
