import { describe, expect, it } from "vitest";
import {
  baseDeliveryPrice,
  cartSubtotal,
  cartTotal,
  changeCartQty,
  groupCart,
  removeCartItem,
} from "./checkout-utils";
import type { CartItem } from "../types";

// Минимальный валидный CartItem (=Fish) для тестов — только поля, которые
// реально участвуют в логике корзины/чекаута.
function makeItem(overrides: Partial<CartItem>): CartItem {
  return {
    id: "f_base",
    type: "fish",
    name: "Тестовая рыба",
    price: 10000,
    ...overrides,
  } as CartItem;
}

describe("groupCart", () => {
  it("на пустой корзине возвращает пустой массив", () => {
    expect(groupCart([])).toEqual([]);
  });

  it("схлопывает повторяющиеся id в одну строку с qty", () => {
    const cart = [makeItem({ id: "f1" }), makeItem({ id: "f1" }), makeItem({ id: "f2" })];
    const grouped = groupCart(cart);
    expect(grouped).toHaveLength(2);
    expect(grouped.find((g) => g.id === "f1")?.qty).toBe(2);
    expect(grouped.find((g) => g.id === "f2")?.qty).toBe(1);
  });

  it("сохраняет порядок первого появления id", () => {
    const cart = [makeItem({ id: "b" }), makeItem({ id: "a" }), makeItem({ id: "b" })];
    const grouped = groupCart(cart);
    expect(grouped.map((g) => g.id)).toEqual(["b", "a"]);
  });
});

describe("cartSubtotal", () => {
  it("на пустой корзине — 0", () => {
    expect(cartSubtotal([])).toBe(0);
  });

  it("суммирует price каждого экземпляра (не price * qty группы)", () => {
    const cart = [makeItem({ id: "f1", price: 15000 }), makeItem({ id: "f1", price: 15000 }), makeItem({ id: "f2", price: 5000 })];
    expect(cartSubtotal(cart)).toBe(35000);
  });

  it("считает по-разному ценённые экземпляры одного id раздельно (не берёт цену первого * qty)", () => {
    // Реалистичный кейс: id один и тот же вид, но цена могла разъехаться
    // (напр. изменилась в каталоге между добавлениями) — subtotal должен
    // отражать реальные цены, а не price первого найденного.
    const cart = [makeItem({ id: "f1", price: 10000 }), makeItem({ id: "f1", price: 12000 })];
    expect(cartSubtotal(cart)).toBe(22000);
  });
});

describe("baseDeliveryPrice", () => {
  it("для пустой корзины доставка всегда 0, даже если у региона есть цена", () => {
    expect(baseDeliveryPrice([], 35000)).toBe(0);
  });

  it("для непустой корзины возвращает цену региона как есть", () => {
    expect(baseDeliveryPrice([makeItem({ id: "f1" })], 35000)).toBe(35000);
  });
});

describe("cartTotal", () => {
  it("итог = товары − скидка + доставка", () => {
    expect(cartTotal(200000, 20000, 25000)).toBe(205000);
  });

  it("без скидки и доставки равен subtotal", () => {
    expect(cartTotal(100000, 0, 0)).toBe(100000);
  });

  it("формула сама не клампит скидку — это обязанность calcPromoSavings (см. promo.test.ts), не cartTotal", () => {
    // Если calcPromoSavings когда-нибудь перестанет ограничивать discount
    // суммой subtotal, cartTotal честно уйдёт в минус, а не спрячет баг —
    // здесь фиксируем именно такое (осознанное) поведение.
    expect(cartTotal(10000, 999999, 0)).toBe(10000 - 999999);
  });

  it("доставка добавляется даже поверх нулевого subtotal-после-скидки", () => {
    expect(cartTotal(10000, 10000, 25000)).toBe(25000);
  });
});

describe("changeCartQty", () => {
  it("delta > 0 клонирует существующий экземпляр (сохраняя его поля)", () => {
    const cart = [makeItem({ id: "f1", price: 12345, variantId: "v1" })];
    const next = changeCartQty(cart, "f1", 1);
    expect(next).toHaveLength(2);
    expect(next[1]).toEqual(next[0]);
    expect(next[1].price).toBe(12345);
    // исходный массив не мутирован
    expect(cart).toHaveLength(1);
  });

  it("delta > 0 для id, которого нет в корзине — корзина не меняется", () => {
    const cart = [makeItem({ id: "f1" })];
    const next = changeCartQty(cart, "ghost", 1);
    expect(next).toBe(cart);
  });

  it("delta < 0 убирает ровно один экземпляр, а не все с этим id", () => {
    const cart = [makeItem({ id: "f1" }), makeItem({ id: "f1" }), makeItem({ id: "f2" })];
    const next = changeCartQty(cart, "f1", -1);
    expect(next.filter((x) => x.id === "f1")).toHaveLength(1);
    expect(next.filter((x) => x.id === "f2")).toHaveLength(1);
    expect(next).toHaveLength(2);
  });

  it("delta < 0 для id, которого нет в корзине — корзина не меняется (не уходит в отрицательный qty)", () => {
    const cart = [makeItem({ id: "f1" })];
    const next = changeCartQty(cart, "ghost", -1);
    expect(next).toBe(cart);
    expect(next).toHaveLength(1);
  });

  it("delta === 0 — корзина не меняется", () => {
    const cart = [makeItem({ id: "f1" })];
    expect(changeCartQty(cart, "f1", 0)).toBe(cart);
  });
});

describe("removeCartItem", () => {
  it("убирает все экземпляры с данным id разом (в отличие от changeCartQty)", () => {
    const cart = [makeItem({ id: "f1" }), makeItem({ id: "f1" }), makeItem({ id: "f2" })];
    const next = removeCartItem(cart, "f1");
    expect(next).toEqual([expect.objectContaining({ id: "f2" })]);
  });

  it("для отсутствующего id возвращает корзину без изменений по содержимому", () => {
    const cart = [makeItem({ id: "f1" })];
    expect(removeCartItem(cart, "ghost")).toEqual(cart);
  });

  it("на пустой корзине возвращает пустой массив", () => {
    expect(removeCartItem([], "f1")).toEqual([]);
  });
});
