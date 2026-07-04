import React, { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { nextDeliveryDate } from "../lib/subscriptions";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useLocalStorageState<any[]>("aqua_subscriptions", []);
  const subscribeToProduct = useCallback((product: any, intervalWeeks: number) => {
    setSubscriptions((subs) => {
      const exists = subs.find((s) => s.productId === product.id);
      const next = nextDeliveryDate(intervalWeeks);
      if (exists) {
        return subs.map((s) => s.productId === product.id
          ? { ...s, intervalWeeks, nextDate: next, paused: false }
          : s);
      }
      return [...subs, {
        id: "sub_" + Date.now(),
        productId: product.id,
        product,
        intervalWeeks,
        nextDate: next,
        createdAt: Date.now(),
        paused: false,
      }];
    });
  }, [setSubscriptions]);
  const cancelSubscription = useCallback((subId: string) => {
    setSubscriptions((subs) => subs.filter((s) => s.id !== subId));
  }, [setSubscriptions]);
  const toggleSubscriptionPause = useCallback((subId: string) => {
    setSubscriptions((subs) => subs.map((s) => s.id === subId ? { ...s, paused: !s.paused } : s));
  }, [setSubscriptions]);
  return { subscriptions, subscribeToProduct, cancelSubscription, toggleSubscriptionPause };
}

// Настройки push-уведомлений (Telegram Bot API).
