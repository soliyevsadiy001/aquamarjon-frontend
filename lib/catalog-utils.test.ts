import { describe, expect, it } from "vitest";
import { checkCompatibility, hashStr } from "./catalog-utils";
import type { Fish } from "../types";

// Минимальный валидный Fish для тестов — только поля, которые реально
// участвуют в checkCompatibility(), остальное необязательно по типу.
function makeFish(overrides: Partial<Fish>): Fish {
  return {
    id: "f_base",
    type: "fish",
    name: "Тестовая рыба",
    price: 10000,
    ...overrides,
  } as Fish;
}

describe("checkCompatibility", () => {
  it("считает совместимой рыбу с пустой корзиной", () => {
    const result = checkCompatibility(makeFish({ id: "f1" }), []);
    expect(result.level).toBe("ok");
    expect(result.reason).toBeNull();
  });

  it("не проверяет совместимость для не-рыб (аксессуары/грунт и т.п.)", () => {
    const accessory = makeFish({ id: "acc1", type: "accessory" });
    const result = checkCompatibility(accessory, [makeFish({ id: "f1" })]);
    expect(result.level).toBe("ok");
  });

  it("помечает bad, если новая рыба в avoid уже лежащей в корзине", () => {
    const inCart = makeFish({ id: "f_predator", name: "Хищник агрессивный", avoid: ["f_small"] });
    const candidate = makeFish({ id: "f_small", name: "Мелкая рыбка" });
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("bad");
    expect(result.reason).toContain("Хищник");
  });

  it("помечает bad симметрично — если корзинная рыба в avoid у новой", () => {
    const inCart = makeFish({ id: "f_small", name: "Мелкая рыбка" });
    const candidate = makeFish({ id: "f_predator", name: "Хищник агрессивный", avoid: ["f_small"] });
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("bad");
  });

  it("использует speciesId вместо id для сопоставления avoid, если он задан", () => {
    const inCart = makeFish({ id: "f_instance_1", speciesId: "species_predator" } as Partial<Fish>);
    const candidate = makeFish({ id: "f_instance_2", speciesId: "species_prey", avoid: ["species_predator"] } as Partial<Fish>);
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("bad");
  });

  it("помечает warn при непересекающихся диапазонах температуры", () => {
    const inCart = makeFish({ id: "f_cold", name: "Холодноводная", temp: [18, 22] });
    const candidate = makeFish({ id: "f_warm", name: "Тепловодная", temp: [26, 30] });
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("warn");
    expect(result.reason).toContain("температур");
  });

  it("не выдаёт warn, если диапазоны температуры пересекаются", () => {
    const inCart = makeFish({ id: "f1", temp: [22, 26] });
    const candidate = makeFish({ id: "f2", temp: [24, 28] });
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("ok");
  });

  it("bad имеет приоритет над warn при одновременном конфликте avoid и температуры", () => {
    const inCart = makeFish({ id: "f_predator", name: "Хищник", avoid: ["f_prey"], temp: [18, 22] });
    const candidate = makeFish({ id: "f_prey", name: "Жертва", temp: [26, 30] });
    const result = checkCompatibility(candidate, [inCart]);
    expect(result.level).toBe("bad");
  });

  it("игнорирует не-рыб в корзине при проверке совместимости", () => {
    const accessory = makeFish({ id: "acc1", type: "accessory", avoid: ["f_new"] });
    const candidate = makeFish({ id: "f_new" });
    const result = checkCompatibility(candidate, [accessory]);
    expect(result.level).toBe("ok");
  });
});

describe("hashStr", () => {
  it("детерминирована — одинаковый вход даёт одинаковый результат", () => {
    expect(hashStr("fish_123")).toBe(hashStr("fish_123"));
  });

  it("разные строки обычно дают разные хэши", () => {
    expect(hashStr("fish_123")).not.toBe(hashStr("fish_124"));
  });

  it("возвращает неотрицательное целое (>>> 0 гарантирует uint32)", () => {
    expect(hashStr("что угодно")).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(hashStr("что угодно"))).toBe(true);
  });
});
