import { describe, expect, it } from "vitest";
import {
  computeDiaryStreaks,
  diaryLevelName,
  diaryPluralRu,
  diaryUrgency,
  getFishSurvivalTier,
} from "./diary-stats";

describe("computeDiaryStreaks", () => {
  it("пустой список дат — обе серии нулевые", () => {
    expect(computeDiaryStreaks(new Set())).toEqual({ current: 0, best: 0 });
  });

  it("одна дата — серия из одного дня", () => {
    expect(computeDiaryStreaks(new Set(["2026-06-01"]))).toEqual({ current: 1, best: 1 });
  });

  it("подряд идущие дни увеличивают текущую серию", () => {
    const dates = new Set(["2026-06-01", "2026-06-02", "2026-06-03"]);
    expect(computeDiaryStreaks(dates)).toEqual({ current: 3, best: 3 });
  });

  it("разрыв между датами сбрасывает текущую серию, но помнит лучшую", () => {
    // 3 дня подряд, разрыв, потом ещё 1 день — лучшая серия должна остаться 3
    const dates = new Set(["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-10"]);
    expect(computeDiaryStreaks(dates)).toEqual({ current: 1, best: 3 });
  });

  it("не зависит от порядка добавления дат в Set (сортирует сама)", () => {
    const dates = new Set(["2026-06-03", "2026-06-01", "2026-06-02"]);
    expect(computeDiaryStreaks(dates)).toEqual({ current: 3, best: 3 });
  });
});

describe("diaryPluralRu", () => {
  it("1, 21, 101 → форма one", () => {
    expect(diaryPluralRu(1, "день", "дня", "дней")).toBe("день");
    expect(diaryPluralRu(21, "день", "дня", "дней")).toBe("день");
    expect(diaryPluralRu(101, "день", "дня", "дней")).toBe("день");
  });

  it("2, 3, 4, 22 → форма few", () => {
    expect(diaryPluralRu(2, "день", "дня", "дней")).toBe("дня");
    expect(diaryPluralRu(3, "день", "дня", "дней")).toBe("дня");
    expect(diaryPluralRu(22, "день", "дня", "дней")).toBe("дня");
  });

  it("0, 5, 11, 12, 14 → форма many (в т.ч. исключение 11-14)", () => {
    expect(diaryPluralRu(0, "день", "дня", "дней")).toBe("дней");
    expect(diaryPluralRu(5, "день", "дня", "дней")).toBe("дней");
    expect(diaryPluralRu(11, "день", "дня", "дней")).toBe("дней");
    expect(diaryPluralRu(12, "день", "дня", "дней")).toBe("дней");
    expect(diaryPluralRu(14, "день", "дня", "дней")).toBe("дней");
  });
});

describe("diaryLevelName", () => {
  it("level ниже первого порога всё равно получает имя первого уровня", () => {
    expect(diaryLevelName(0)).toBe("Новичок");
  });

  it("возвращает имя точно на пороге", () => {
    expect(diaryLevelName(3)).toBe("Любитель");
    expect(diaryLevelName(6)).toBe("Опытный аквариумист");
    expect(diaryLevelName(15)).toBe("Гуру");
  });

  it("между порогами берёт последний пройденный, а не следующий", () => {
    expect(diaryLevelName(5)).toBe("Любитель"); // между 3 (Любитель) и 6 (Опытный)
  });

  it("выше максимального порога остаётся на максимальном имени", () => {
    expect(diaryLevelName(999)).toBe("Гуру");
  });
});

describe("getFishSurvivalTier", () => {
  // FISH_SURVIVAL_TIERS = [30, 100, 365] в data/diary-content.ts
  it("меньше первого порога — тира нет (-1)", () => {
    expect(getFishSurvivalTier(10)).toBe(-1);
  });

  it("возвращает индекс тира ровно на границе", () => {
    expect(getFishSurvivalTier(30)).toBe(0);
    expect(getFishSurvivalTier(100)).toBe(1);
    expect(getFishSurvivalTier(365)).toBe(2);
  });

  it("между порогами — индекс последнего пройденного", () => {
    expect(getFishSurvivalTier(50)).toBe(0);
    expect(getFishSurvivalTier(200)).toBe(1);
  });

  it("выше всех порогов — индекс последнего тира", () => {
    expect(getFishSurvivalTier(1000)).toBe(2);
  });
});

describe("diaryUrgency", () => {
  it("меньше 75% интервала — ok", () => {
    expect(diaryUrgency(3, 7)).toBe("ok"); // 3/7 ≈ 0.43
  });

  it("75%–99% интервала — soon", () => {
    expect(diaryUrgency(6, 7)).toBe("soon"); // 6/7 ≈ 0.86
  });

  it("100% и больше интервала — overdue", () => {
    expect(diaryUrgency(7, 7)).toBe("overdue");
    expect(diaryUrgency(10, 7)).toBe("overdue");
  });

  it("граница 0.75 включительно — soon, а не ok", () => {
    expect(diaryUrgency(3, 4)).toBe("soon"); // ровно 0.75
  });
});
