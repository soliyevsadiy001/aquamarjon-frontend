import React, { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export function useOrders() {
  const [orders, setOrders] = useLocalStorageState<any[]>("aqua_orders", []);
  const addOrder = useCallback((order: any) => setOrders((o) => [...o, order]), [setOrders]);
  return { orders, setOrders, addOrder };
}

// ------------------------------------------------------------------
// Авторизация продавца/курьера — раньше 4 независимых useState
// (accounts, loggedInAcc, needChangePwd, noAccessRole), которые
// менялись НЕСКОЛЬКИМИ setState подряд в одном обработчике (например,
// onLogin делал setLoggedInAcc + setNeedChangePwd одновременно).
// Это ровно тот случай, для которого React рекомендует useReducer:
// связанные значения, которые всегда меняются вместе по чётким
// переходам состояния (вышел из аккаунта -> сброс сразу двух полей
// и т.д.). Реализация reducer'а — чистая функция без побочных
// эффектов (clearToken() вызывается в обёртке logout(), а не в самом
// reducer'е).
