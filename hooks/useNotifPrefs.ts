import React, { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { DEFAULT_NOTIF_PREFS, NotifPrefs, syncNotifPrefs } from "../lib/notify";

export function useNotifPrefs() {
  const [notifPrefs, setNotifPrefs] = useLocalStorageState<NotifPrefs>("aqua_notif_prefs", DEFAULT_NOTIF_PREFS);
  const updateNotifPref = useCallback((key: keyof NotifPrefs, value: boolean) => {
    setNotifPrefs((p) => {
      const next = { ...p, [key]: value };
      syncNotifPrefs(next);
      return next;
    });
  }, [setNotifPrefs]);
  return { notifPrefs, updateNotifPref };
}

// Заказы пользователя и их статусы — храним в localStorage, иначе
// «Повторить заказ»/трекинг статуса доставки слетают при перезагрузке
// страницы (бэкенд для пользовательских заказов сейчас не опрашивается).
