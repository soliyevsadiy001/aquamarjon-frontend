import { FISH_DB } from "../data/fish";
import { getStock } from "./catalog-utils";
import { notifyTelegram } from "./notify";
import { readLocal, writeLocal } from "./storage";

export const WISHLIST_NOTIFIED_KEY = "aqua_wishlist_notified_changes";


export function getWishlistAlerts(wishlist) {
  const alerts = [];
  for (const item of wishlist || []) {
    const live = FISH_DB.find((f) => f.id === item.id);
    if (!live) continue;
    if (live.price < item.price) {
      alerts.push({ item, live, type: "price_drop", pct: Math.round((1 - live.price / item.price) * 100) });
    }
    const wasOut = item.stock === 0 || item.outOfStock === true;
    const nowIn = getStock(live) > 0;
    if (wasOut && nowIn) {
      alerts.push({ item, live, type: "restock" });
    }
  }
  return alerts;
}


export async function notifyWishlistAlerts(wishlist) {
  const alerts = getWishlistAlerts(wishlist);
  if (alerts.length === 0) return;
  const notified = readLocal(WISHLIST_NOTIFIED_KEY, {});
  for (const a of alerts) {
    const dedupeKey = `${a.item.id}:${a.type}:${a.type === "price_drop" ? a.live.price : "in"}`;
    if (notified[dedupeKey]) continue;
    const ok = await notifyTelegram("new_arrival", a.type === "price_drop"
      ? { name: a.live.name, price: a.live.price, oldPrice: a.item.price, emoji: a.live.img, reason: "price_drop" }
      : { name: a.live.name, price: a.live.price, emoji: a.live.img, reason: "restock" });
    if (ok) notified[dedupeKey] = true;
  }
  writeLocal(WISHLIST_NOTIFIED_KEY, notified);
}

