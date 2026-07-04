import { COLORS } from "../theme";
import { readLocal, writeLocal } from "../lib/storage";
import type { CatalogOverrides, Fish, FishCatalogVariant, StockOverrides } from "../types";

export const FISH_DB_BASE: Fish[] = [
  {
    id: "guppy",
    type: "fish",
    name: "Гуппи «Огненный хвост»",
    latin: "Poecilia reticulata",
    price: 25000,
    rating: 4.9,
    reviews: 48,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🐠",
    color: COLORS.amber,
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Вырастает до 4 см — помещается на ладони. Живёт 3–5 лет при хорошем уходе. Мирная, дружит почти со всеми соседями.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 6.8–7.8 · dGH 8–12 · NH₃ 0 мг/л · мин. объём 40 л",
    minVolume: 40,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "neon",
    type: "fish",
    name: "Неон «Голубая искра»",
    latin: "Paracheirodon innesi",
    price: 8000,
    rating: 4.8,
    reviews: 112,
    temp: [20, 26],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: ["betta"],
    img: "🐟",
    color: COLORS.teal,
    badges: ["🌱 Легко", "✈️ Привозная"],
    about: "Стайная рыбка, держать от 6 штук — иначе будет нервничать в одиночестве. Размер 3 см, живёт 4–6 лет.",
    origin_story: "🌏 Привезена из лучшего питомника Азии. Прошла 2 недели карантина — здоровая и готова к новому дому.",
    pro: "pH 5.5–7.5 · dGH 5–10 · NH₃ 0 мг/л · мин. объём 60 л (стайно)",
    minVolume: 60,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "betta",
    type: "fish",
    name: "Петушок «Королевский бархат»",
    latin: "Betta splendens",
    price: 45000,
    rating: 5.0,
    reviews: 31,
    temp: [24, 29],
    temper: "aggressive",
    size: "medium",
    origin: "local",
    avoid: ["guppy", "neon"],
    img: "👑",
    color: COLORS.amber,
    badges: ["👑 Для опытных", "❤️ Узнаёт хозяина"],
    about: "Гордая одиночная рыба — не любит соседей похожих на себя по форме хвоста. Живёт 2–4 года. Узнаёт хозяина и реагирует на палец у стекла.",
    origin_story: "🏠 Выращен у нас в Ташкенте, отдельно в своём сосуде — петушки не выносят тесноты с раннего возраста.",
    pro: "pH 6.0–7.5 · dGH 5–15 · NH₃ 0 мг/л · мин. объём 20 л (один)",
    minVolume: 20,
    goal: ["beauty", "pets"],
    difficulty: "medium",
  },
  {
    id: "ancistrus",
    type: "fish",
    name: "Анциструс «Чистильщик»",
    latin: "Ancistrus sp.",
    price: 20000,
    rating: 4.7,
    reviews: 19,
    temp: [22, 27],
    temper: "peaceful",
    size: "medium",
    origin: "local",
    avoid: [],
    img: "🐡",
    color: COLORS.teal,
    badges: ["🤝 Мирная", "🏠 Местная"],
    about: "Ваш помощник по чистоте — ест водоросли со стёкол. Размер до 12 см, живёт 8–10 лет — самая долгоживущая рыба в магазине.",
    origin_story: "🏠 Выращен у нас в Ташкенте. Привык к местной воде, адаптация — почти мгновенная.",
    pro: "pH 6.5–7.5 · dGH 6–14 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "molly",
    type: "fish",
    name: "Молли «Чёрный бархат»",
    latin: "Poecilia sphenops",
    price: 18000,
    rating: 4.6,
    reviews: 27,
    temp: [24, 28],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: [],
    img: "🐟",
    color: COLORS.amber,
    badges: ["🌱 Легко", "✈️ Привозная"],
    about: "Спокойная и неприхотливая, отлично смотрится с гуппи и неонами. Размер до 7 см, живёт 3–5 лет.",
    origin_story: "🌏 Привезена из питомника Таиланда. Прошла карантин 14 дней.",
    pro: "pH 7.0–8.5 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "discus",
    type: "fish",
    name: "Дискус «Королевский»",
    latin: "Symphysodon sp.",
    price: 180000,
    rating: 5.0,
    reviews: 8,
    temp: [28, 30],
    temper: "peaceful",
    size: "large",
    origin: "import",
    avoid: [],
    img: "👑",
    color: COLORS.teal,
    badges: ["👑 Для опытных", "🔴 Редкая", "✈️ Привозная"],
    about: "Венец аквариумистики — крупная, благородная, требует тёплой воды. Размер до 20 см, живёт 10–15 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла усиленный 21-дневный карантин.",
    pro: "pH 6.0–7.0 · dGH 3–8 · NH₃ 0 мг/л · мин. объём 200 л",
    minVolume: 200,
    goal: ["beauty"],
    difficulty: "hard",
  },
  {
    id: "angelfish",
    type: "fish",
    name: "Скалярия «Серебряный парус»",
    latin: "Pterophyllum scalare",
    price: 55000,
    rating: 4.8,
    reviews: 22,
    temp: [24, 28],
    temper: "semi",
    size: "large",
    origin: "import",
    avoid: ["neon", "guppy"],
    img: "🦈",
    color: COLORS.teal,
    badges: ["👑 Для опытных", "🤝 Полумирная"],
    about: "Изящная и величественная — «королева аквариума». Может попробовать съесть мелких рыб типа неонов. Размер до 15 см, живёт 8–10 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 14 дней.",
    pro: "pH 6.5–7.5 · dGH 4–14 · NH₃ 0 мг/л · мин. объём 100 л",
    minVolume: 100,
    goal: ["beauty"],
    difficulty: "medium",
  },
  {
    id: "danio",
    type: "fish",
    name: "Данио «Зебра»",
    latin: "Danio rerio",
    price: 7000,
    rating: 4.7,
    reviews: 64,
    temp: [18, 26],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: [],
    img: "🐟",
    color: COLORS.amber,
    badges: ["🌱 Легко", "🏠 Местная", "🧒 Для детей"],
    about: "Очень активная и выносливая — отлично переносит перепады температуры, идеальна для первого аквариума. Размер 4 см, живёт 3–5 лет.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Одна из самых неприхотливых рыб в магазине.",
    pro: "pH 6.5–7.5 · dGH 5–12 · NH₃ 0 мг/л · мин. объём 40 л (стайно)",
    minVolume: 40,
    goal: ["beauty", "pets", "kids"],
    difficulty: "easy",
  },
  {
    id: "goldfish",
    type: "fish",
    name: "Золотая рыбка «Комета»",
    latin: "Carassius auratus",
    price: 22000,
    rating: 4.6,
    reviews: 41,
    temp: [16, 24],
    temper: "peaceful",
    size: "large",
    origin: "local",
    avoid: [],
    img: "🐠",
    color: COLORS.amber,
    badges: ["🌱 Легко", "🏠 Местная", "🧒 Для детей"],
    about: "Классика жанра — узнаёт хозяина, может жить и в холодной воде. Размер до 18 см, живёт 10–15 лет при хорошем уходе.",
    origin_story: "🏠 Выращена у нас в Ташкенте, легко приживается в любой воде региона.",
    pro: "pH 6.5–8.0 · dGH 8–18 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["pets", "kids", "beauty"],
    difficulty: "easy",
  },
  {
    id: "clownloach",
    type: "fish",
    name: "Боция «Клоун»",
    latin: "Chromobotia macracanthus",
    price: 38000,
    rating: 4.9,
    reviews: 14,
    temp: [25, 29],
    temper: "peaceful",
    size: "medium",
    origin: "import",
    avoid: [],
    img: "🐡",
    color: COLORS.teal,
    badges: ["🤝 Мирная", "✈️ Привозная", "🔴 Редкая"],
    about: "Яркая полосатая рыба со своим характером — может «трещать» клешнями, когда радуется еде. Размер до 15 см, живёт 15–20 лет.",
    origin_story: "🌏 Привезена из питомника Индонезии. Прошла усиленный карантин 21 день.",
    pro: "pH 6.0–7.5 · dGH 5–12 · NH₃ 0 мг/л · мин. объём 150 л (стайно)",
    minVolume: 150,
    goal: ["beauty"],
    difficulty: "medium",
  },
  {
    id: "parrotcichlid",
    type: "fish",
    name: "Цихлида «Попугай»",
    latin: "Cichlasoma sp. (hybrid)",
    price: 65000,
    rating: 4.5,
    reviews: 17,
    temp: [25, 29],
    temper: "aggressive",
    size: "large",
    origin: "import",
    avoid: ["neon", "guppy", "danio", "molly"],
    img: "👑",
    color: COLORS.amber,
    badges: ["👑 Для опытных", "⚔️ Территориальная"],
    about: "Яркая, запоминающаяся форма тела, но территориальна — лучше держать без мелких соседей. Размер до 20 см, живёт 10–12 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 18 дней.",
    pro: "pH 6.5–7.5 · dGH 8–15 · NH₃ 0 мг/л · мин. объём 150 л",
    minVolume: 150,
    goal: ["beauty"],
    difficulty: "hard",
  },
  {
    id: "swordtail_red",
    type: "fish",
    name: "Меченосец «Красный»",
    latin: "Xiphophorus hellerii",
    price: 18000,
    rating: 4.8,
    reviews: 64,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🗡️",
    color: "#E14B4B",
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Узнаваема по «мечу» — вытянутому нижнему лучу хвостового плавника у самцов. Размер до 8 см, живёт 3–5 лет. Активна и неприхотлива.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets", "breeding"],
    difficulty: "easy",
  },
  {
    id: "swordtail_black",
    type: "fish",
    name: "Меченосец «Чёрный бархат»",
    latin: "Xiphophorus hellerii var.",
    price: 22000,
    rating: 4.7,
    reviews: 39,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "local",
    avoid: ["betta"],
    img: "🗡️",
    color: "#2B2B2B",
    badges: ["🌱 Легко", "🏠 Местная"],
    about: "Бархатно-чёрный окрас по всему телу, контрастный «меч» на хвосте. Размер до 8 см, живёт 3–5 лет. Мирная, хорошо смотрится стайкой.",
    origin_story: "🏠 Выращена у нас в Ташкенте. Уже привыкла к местной воде — легко приживётся в вашем аквариуме.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 60 л",
    minVolume: 60,
    goal: ["beauty", "pets"],
    difficulty: "easy",
  },
  {
    id: "swordtail_indo_green",
    type: "fish",
    name: "Меченосец «Индонезийский зелёный»",
    latin: "Xiphophorus hellerii var.",
    price: 35000,
    rating: 4.9,
    reviews: 21,
    temp: [22, 28],
    temper: "peaceful",
    size: "small",
    origin: "import",
    avoid: ["betta"],
    img: "🗡️",
    color: "#3CA96A",
    badges: ["✈️ Привозная", "🔴 Редкая"],
    about: "Редкая привозная форма с зеленовато-оливковым отливом и длинным «мечом». Размер до 9 см, живёт 3–5 лет.",
    origin_story: "🌏 Привезена из питомника Юго-Восточной Азии. Прошла карантин 14 дней — здоровая и готова к новому дому.",
    pro: "pH 7.0–8.2 · dGH 10–20 · NH₃ 0 мг/л · мин. объём 80 л",
    minVolume: 80,
    goal: ["beauty"],
    difficulty: "medium",
  },
];

/* ============================================================
   🐠 Каталог «вид → карточки (варианты/окрасы) → размеры»
   ------------------------------------------------------------
   FISH_DB_BASE выше — это биология вида (температура, характер,
   совместимость, мин. объём и т.п.), общая для всех его карточек.

   Поверх неё лежит "витрина", которую полностью ведёт АДМИН:
   у вида может быть несколько карточек-вариантов (окрас/порода),
   у каждой карточки — своё фото и несколько размеров (см), и у
   каждого размера — своя цена. Продавец эту витрину не трогает —
   он только выбирает готовую карточку+размер и указывает остаток.

   Все данные витрины и остатков хранятся в localStorage поверх
   "затравки" (seed) ниже, поэтому правки админа и продавца
   переживают перезагрузку страницы.
   ============================================================ */


export const FISH_CATALOG_KEY = "aqua_admin_fish_catalog_v1";

export const FISH_STOCK_KEY = "aqua_seller_stock_v1";

// Затравка витрины — по умолчанию у части видов уже есть несколько
// карточек-вариантов с размерами/ценами (админ может дополнить или
// изменить это в любой момент через панель администратора).

export const FISH_CATALOG_SEED: CatalogOverrides = {
  guppy: {
    variants: [
      { id: "firetail", name: "Огненный хвост", photo: null,
        sizes: [ { id: "s1", cm: "2–3", price: 18000 }, { id: "s2", cm: "4–5", price: 25000 }, { id: "s3", cm: "6+", price: 35000 } ] },
      { id: "cobra", name: "Кобра", photo: null,
        sizes: [ { id: "s1", cm: "3–4", price: 22000 }, { id: "s2", cm: "5–6", price: 32000 } ] },
      { id: "tuxedo", name: "Тукседо", photo: null,
        sizes: [ { id: "s1", cm: "3–4", price: 20000 }, { id: "s2", cm: "5–6", price: 28000 } ] },
    ],
  },
  neon: {
    variants: [
      { id: "classic", name: "Голубая искра", photo: null,
        sizes: [ { id: "s1", cm: "2–3", price: 8000 }, { id: "s2", cm: "3–4", price: 11000 } ] },
      { id: "black", name: "Чёрный неон", photo: null,
        sizes: [ { id: "s1", cm: "2–3", price: 9000 }, { id: "s2", cm: "3–4", price: 12500 } ] },
    ],
  },
  betta: {
    variants: [
      { id: "royal_velvet", name: "Королевский бархат", photo: null,
        sizes: [ { id: "s1", cm: "4–5", price: 45000 }, { id: "s2", cm: "6+", price: 65000 } ] },
      { id: "blue_veil", name: "Синяя вуаль", photo: null,
        sizes: [ { id: "s1", cm: "4–5", price: 42000 }, { id: "s2", cm: "6+", price: 60000 } ] },
      { id: "red_crown", name: "Красная корона", photo: null,
        sizes: [ { id: "s1", cm: "4–5", price: 48000 } ] },
    ],
  },
  danio: {
    variants: [
      { id: "zebra", name: "Зебра", photo: null,
        sizes: [ { id: "s1", cm: "2–3", price: 6000 }, { id: "s2", cm: "3–4", price: 8500 } ] },
      { id: "leopard", name: "Леопардовый", photo: null,
        sizes: [ { id: "s1", cm: "2–3", price: 7000 } ] },
    ],
  },
  ancistrus: {
    variants: [
      { id: "common", name: "Обычный", photo: null,
        sizes: [ { id: "s1", cm: "4–5", price: 20000 }, { id: "s2", cm: "8–10", price: 32000 } ] },
      { id: "albino", name: "Альбинос", photo: null,
        sizes: [ { id: "s1", cm: "4–5", price: 26000 }, { id: "s2", cm: "8–10", price: 38000 } ] },
    ],
  },
  molly: {
    variants: [
      { id: "black_velvet", name: "Чёрный бархат", photo: null,
        sizes: [ { id: "s1", cm: "3–4", price: 18000 }, { id: "s2", cm: "5–7", price: 24000 } ] },
      { id: "balloon", name: "Баллон", photo: null,
        sizes: [ { id: "s1", cm: "3–4", price: 21000 } ] },
    ],
  },
};


export function getCatalogOverrides(): CatalogOverrides { return readLocal<CatalogOverrides>(FISH_CATALOG_KEY, {}); }

export function saveCatalogOverrides(next: CatalogOverrides): void { writeLocal(FISH_CATALOG_KEY, next); }


export function getStockOverrides(): StockOverrides { return readLocal<StockOverrides>(FISH_STOCK_KEY, {}); }

export function setStockOverride(fishId: string, qty: number): StockOverrides {
  const m = getStockOverrides();
  m[fishId] = Math.max(0, Number(qty) || 0);
  writeLocal(FISH_STOCK_KEY, m);
  return m;
}

// Собирает итоговый список вариантов вида: правки админа (localStorage)
// полностью заменяют затравку для этого вида, если они есть.

export function getSpeciesVariants(speciesId: string): FishCatalogVariant[] | null {
  const overrides = getCatalogOverrides();
  if (overrides[speciesId] && Array.isArray(overrides[speciesId].variants)) {
    return overrides[speciesId].variants;
  }
  const seed = FISH_CATALOG_SEED[speciesId];
  return seed ? seed.variants : null;
}

// Разворачивает FISH_DB_BASE в плоский список карточек: у видов без
// собственной витрины — одна карточка (как раньше), у видов с
// витриной — по карточке на каждый размер каждого варианта.
// Базовые названия в FISH_DB_BASE исторически несли декоративное
// «Название окраса» (напр. Неон «Голубая искра») — теперь это стало
// именем ПЕРВОГО варианта, поэтому для отображения самого вида нужно
// чистое имя без хвоста в кавычках.

export function speciesShortName(base: Fish): string {
  return base.name.split(" «")[0];
}


export function buildFishDb(): Fish[] {
  const out: Fish[] = [];
  for (const base of FISH_DB_BASE) {
    const variants = getSpeciesVariants(base.id);
    if (!variants || variants.length === 0) {
      out.push({ ...base, speciesId: base.id, speciesName: speciesShortName(base), variantId: "base", variantName: null, sizeId: "base", cm: null });
      continue;
    }
    for (const variant of variants) {
      const sizes = variant.sizes && variant.sizes.length ? variant.sizes : [{ id: "s1", cm: null, price: base.price }];
      const sizeSiblings = sizes.map((s) => ({
        id: `${base.id}__${variant.id}__${s.id}`, sizeId: s.id, cm: s.cm, price: s.price,
      }));
      for (const s of sizes) {
        out.push({
          ...base,
          id: `${base.id}__${variant.id}__${s.id}`,
          speciesId: base.id,
          speciesName: speciesShortName(base),
          variantId: variant.id,
          variantName: variant.name,
          sizeId: s.id,
          cm: s.cm,
          price: s.price,
          photo: variant.photo || null,
          badges: variant.badges || base.badges,
          name: `${speciesShortName(base)} «${variant.name}»${s.cm ? `, ${s.cm} см` : ""}`,
          sizeSiblings,
        });
      }
    }
  }
  return out;
}

// Список видов, у которых есть несколько карточек-вариантов —
// используется в каталоге, чтобы решить, показывать ли товар как
// обычную карточку (как раньше) или как карточку-группу «N видов».

export function getMultiVariantSpeciesIds(): Set<string> {
  const ids = new Set<string>();
  for (const base of FISH_DB_BASE) {
    const variants = getSpeciesVariants(base.id);
    if (variants && variants.length > 0) ids.add(base.id);
  }
  return ids;
}


export const FISH_DB = buildFishDb();

// Оборудование, корм и растения — товары без AI-совместимости рыб,
// но с собственными значками и категориями
