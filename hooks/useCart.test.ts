import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useCart } from "./useCart";

const KEY = "aqua_cart";

afterEach(() => {
  localStorage.clear();
});

describe("useCart", () => {
  it("без данных в localStorage стартует с пустой корзины", () => {
    const { result } = renderHook(() => useCart());
    const [cart] = result.current;
    expect(cart).toEqual([]);
  });

  it("при монтировании подхватывает уже сохранённую корзину (напр. после перезагрузки страницы)", () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: "f1", price: 10000 }]));
    const { result } = renderHook(() => useCart());
    const [cart] = result.current;
    expect(cart).toEqual([{ id: "f1", price: 10000 }]);
  });

  it("setCart с новым массивом сохраняет его в localStorage под ключом aqua_cart", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      const [, setCart] = result.current;
      setCart([{ id: "f1", price: 10000 }]);
    });
    expect(JSON.parse(localStorage.getItem(KEY) || "null")).toEqual([{ id: "f1", price: 10000 }]);
    expect(result.current[0]).toEqual([{ id: "f1", price: 10000 }]);
  });

  it("setCart в функциональной форме (как в добавлении/удалении товара) видит актуальное состояние", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      const [, setCart] = result.current;
      setCart([{ id: "f1", price: 10000 }]);
    });
    act(() => {
      const [, setCart] = result.current;
      setCart((prev) => [...prev, { id: "f2", price: 5000 }]);
    });
    expect(result.current[0]).toEqual([
      { id: "f1", price: 10000 },
      { id: "f2", price: 5000 },
    ]);
    expect(JSON.parse(localStorage.getItem(KEY) || "null")).toHaveLength(2);
  });

  it("пустой массив сохраняется корректно и не откатывается к прежним данным (после оформления заказа)", () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: "f1", price: 10000 }]));
    const { result } = renderHook(() => useCart());
    act(() => {
      const [, setCart] = result.current;
      setCart([]);
    });
    expect(result.current[0]).toEqual([]);
    expect(JSON.parse(localStorage.getItem(KEY) || "null")).toEqual([]);
  });

  it("битый JSON в localStorage не роняет хук — стартует с пустой корзины", () => {
    localStorage.setItem(KEY, "{not valid json");
    const { result } = renderHook(() => useCart());
    expect(result.current[0]).toEqual([]);
  });
});
