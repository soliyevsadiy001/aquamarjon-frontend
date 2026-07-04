import type { CartItem, GroupedCartItem } from "../types";

export function groupCart(cart: CartItem[]): GroupedCartItem[] {
  const map = new Map<string, GroupedCartItem>();
  cart.forEach((item) => {
    const existing = map.get(item.id);
    if (existing) existing.qty += 1;
    else map.set(item.id, { ...item, qty: 1 });
  });
  return Array.from(map.values());
}

/** Сумма товаров в корзине (без доставки и скидки). Деньги = сумма реального
 *  прайса каждого экземпляра — те же числа, что видит бэкенд при создании заказа. */
export function cartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

/** Цена доставки по региону — но 0, если корзина пуста (нечего везти). */
export function baseDeliveryPrice(cart: CartItem[], regionPrice: number): number {
  return cart.length === 0 ? 0 : regionPrice;
}

/** Итог заказа: товары − скидка + доставка. Скидку в минус не клампим здесь —
 *  это ответственность calcPromoSavings() (см. promo.ts), которая уже
 *  гарантирует discount <= subtotal; так total = subtotal - discount + delivery
 *  остаётся точно той же формулой, что была в Checkout.tsx до выноса. */
export function cartTotal(subtotal: number, discount: number, delivery: number): number {
  return subtotal - discount + delivery;
}

/**
 * Изменение количества товара с id на delta (+1/-1 из чекаута).
 * delta > 0 — клонируем один существующий экземпляр (сохраняет все его
 * поля/вариант/размер, а не создаёт новый из каталога).
 * delta < 0 — убираем ровно один экземпляр (не всю группу — см. removeCartItem).
 * Если товара с таким id в корзине нет, корзина не меняется.
 */
export function changeCartQty(cart: CartItem[], id: string, delta: number): CartItem[] {
  if (delta > 0) {
    const proto = cart.find((x) => x.id === id);
    return proto ? [...cart, { ...proto }] : cart;
  }
  if (delta < 0) {
    const idx = cart.findIndex((x) => x.id === id);
    if (idx === -1) return cart;
    const copy = [...cart];
    copy.splice(idx, 1);
    return copy;
  }
  return cart;
}

/** Полностью убирает товар с данным id из корзины (все экземпляры сразу,
 *  в отличие от changeCartQty(-1), которая снимает по одному). */
export function removeCartItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((x) => x.id !== id);
}

/* ── Карта выбора адреса (OpenStreetMap через Leaflet) ───── */
