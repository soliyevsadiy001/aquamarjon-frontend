import { useLocalStorageState } from "./useLocalStorageState";

export function useCart() {
  return useLocalStorageState<any[]>("aqua_cart", []);
}

// Избранное — отдельно от корзины, переживает перезагрузку и работает офлайн.
