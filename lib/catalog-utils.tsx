import React from "react";
import { COLORS } from "../theme";
import { getStockOverrides } from "../data/fish";
import type { CartItem, CompatResult, Fish } from "../types";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { color: COLORS.teal, fontWeight: 800 } as const;


export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={__style1}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}


export function formatSum(n: number): string {
  return n.toLocaleString("ru-RU") + " сум";
}


export function checkCompatibility(fish: Fish, cartItems: CartItem[]): CompatResult {
  if (fish.type !== "fish") return { level: "ok", reason: null }; // совместимость считаем только для рыб
  const fishOnlyCart = cartItems.filter((i) => i.type === "fish");
  if (fishOnlyCart.length === 0) return { level: "ok", reason: null };
  const fishAvoid = fish.avoid ?? [];
  for (const item of fishOnlyCart) {
    const fishSpecies = fish.speciesId || fish.id;
    const itemSpecies = item.speciesId || item.id;
    const itemAvoid = item.avoid ?? [];
    if (fishAvoid.includes(itemSpecies) || itemAvoid.includes(fishSpecies)) {
      return { level: "bad", reason: `Не уживается с «${item.name.split(" ")[0]}» — разный темперамент` };
    }
    if (fish.temp && item.temp) {
      const overlap =
        Math.max(fish.temp[0], item.temp[0]) <= Math.min(fish.temp[1], item.temp[1]);
      if (!overlap) {
        return { level: "warn", reason: `Разная температура воды с «${item.name.split(" ")[0]}»` };
      }
    }
  }
  return { level: "ok", reason: null };
}

/* ---------- Доверие: остаток в наличии + текстовые отзывы ----------
   Детерминированная "псевдо-БД" остатков и отзывов на основе id товара,
   чтобы не переписывать вручную все 126 позиций FISH_DB. */

export function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Расширяем "new_arrival" с общих новинок на конкретные позиции из вишлиста:
// сравниваем цену/наличие на момент добавления в избранное с актуальными
// данными FISH_DB и шлём точечный пуш «эта рыба подешевела / снова в наличии»,
// а не только общую рассылку о новых поступлениях.

export function getStock(fish: Fish): number {
  const overrides = getStockOverrides();
  if (Object.prototype.hasOwnProperty.call(overrides, fish.id)) {
    return overrides[fish.id];
  }
  const h = hashStr(fish.id);
  // Редкие/дорогие/премиум товары — меньше остатков, обычные — больше
  const base = fish.price > 100000 ? 4 : fish.price > 40000 ? 9 : 16;
  const stock = 1 + (h % base);
  return stock;
}

