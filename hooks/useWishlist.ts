import React, { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorageState<any[]>("aqua_wishlist", []);
  const toggleWishlist = useCallback((fish: any) => {
    setWishlist((w) => (w.some((x) => x.id === fish.id) ? w.filter((x) => x.id !== fish.id) : [...w, fish]));
  }, [setWishlist]);
  return { wishlist, setWishlist, toggleWishlist };
}

// Подписка на корм/расходники — повторяющиеся заказы со скидкой.
