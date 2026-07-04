// ============================================================
// Доменные типы приложения AquaMarjon.
// Вынесены из App.tsx (были разбросаны по файлу как implicit any
// в деструктурированных пропсах и inline-литералах) в один источник
// правды, чтобы:
//  - опечатка в поле рыбы/заказа ловилась компилятором, а не в рантайме;
//  - публичные пропсы фич-компонентов (FishCard, FishDetail, Catalog,
//    Checkout и т.д.) можно было типизировать без копирования одной
//    и той же формы объекта в каждом компоненте.
// ============================================================

/** Название региона доставки — строка из справочника REGIONS. */
export type Region = string;

/** Ключ роли для кабинетов продавца/курьера/админа. */
export type Role = "seller" | "courier" | "admin";

/** Уровень сложности содержания рыбы. */
export type Difficulty = "easy" | "medium" | "hard";

/** Темперамент рыбы — используется при проверке совместимости. */
export type Temperament = "peaceful" | "semi" | "aggressive";

/** Размерная категория рыбы. */
export type FishSize = "small" | "medium" | "large";

/** Происхождение — влияет на бейджи и origin story в карточке. */
export type FishOrigin = "local" | "import";

/** Цель покупки — используется в квизе и рекомендациях. */
export type FishGoal = "beauty" | "pets" | "breeding" | string;

/**
 * Карточка товара — рыба, растение или оборудование в каталоге.
 * Поле `type` пока фактически всегда "fish" в FISH_DB_BASE, но
 * оставлено строкой, т.к. каталог задуман шире (растения/техника).
 */
export interface Fish {
  id: string;
  type: string;
  name: string;
  latin?: string;
  price: number;
  rating?: number;
  reviews?: number;
  temp?: [number, number];
  temper?: Temperament;
  size?: FishSize;
  origin?: FishOrigin;
  avoid?: string[];
  img?: string;
  photo?: string | null;
  color?: string;
  badges?: string[];
  about?: string;
  origin_story?: string;
  pro?: string;
  minVolume?: number;
  goal?: FishGoal[];
  difficulty?: Difficulty;
  // Поля, добавляемые buildFishDb() поверх FISH_DB_BASE при раскрытии
  // вариантов/размеров конкретного вида:
  speciesId?: string;
  speciesName?: string;
  variantId?: string;
  variantName?: string | null;
  sizeId?: string;
  // Размер хранится как строка-диапазон ("2–3", "6+"), а не число — так его
  // вводит админ и показывает UI (см. FISH_CATALOG_SEED/AdminPanel).
  cm?: string | null;
  sizeSiblings?: Array<{ id: string; sizeId: string; cm: string | null; price: number }>;
  // Синтетические карточки-«группы вида» в каталоге (когда у вида несколько
  // вариантов/размеров, показываем одну карточку с количеством вариантов
  // вместо списка дублей) — см. Catalog().
  isSpeciesGroup?: boolean;
  variantsCount?: number;
}

/**
 * Элемент корзины. Корзина хранится как плоский массив Fish — один
 * повтор id = один экземпляр товара (qty визуально считается через
 * groupCart(), а не хранится на самом объекте в корзине).
 */
export type CartItem = Fish;

/** Сгруппированная по id строка корзины (для чекаута/дровера). */
export interface GroupedCartItem extends Fish {
  qty: number;
}

/** Статус доставки заказа — см. ORDER_STATUSES. */
export type OrderStatus = "accepted" | "packed" | "courier" | "way" | "delivered";

/** Данные о доставке по региону — см. DELIVERY_RATES. */
export interface DeliveryInfo {
  price: number;
  time: string;
  courier: string;
  phone: string;
  rating: number;
  trips: number;
}

/** Оформленный заказ, как его хранит App() и показывает Profile/DeliveryTracker. */
export interface Order {
  id: string | number;
  date: string;
  items: CartItem[];
  total: number;
  address: string;
  slot: string;
  pay: string;
  region: Region;
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
}

/** Аккаунт продавца/курьера/админа в админ-панели.
 *  `password` заполнен только сразу после создания аккаунта (ответ
 *  POST /admin/accounts) — во всех остальных случаях это `null`, т.к.
 *  бэкенд больше не хранит и не отдаёт постоянный plaintext-пароль
 *  (см. AdminAccountsTab.tsx — сброс пароля вместо просмотра). */
export interface Account {
  id: string;
  role: "seller" | "courier" | "admin";
  name: string;
  phone: string;
  region: string;
  login: string;
  password: string | null;
  active: boolean;
  lastLogin: string;
  tempPass: string | null;
}

/** Итог проверки совместимости рыбы с остальной корзиной/аквариумом — см. checkCompatibility(). */
export type CompatLevel = "ok" | "warn" | "bad";

export interface CompatResult {
  level: CompatLevel;
  reason: string | null;
}

/** Ярлык поста клуба (тема/цвет) — см. CLUB_TABS/ClubComposeModal. */
export interface ClubPostTag {
  label: string;
  color: string;
}

/** Пост ленты Клуба — см. CLUB_POSTS и ClubScreen. */
export interface ClubPost {
  id: string;
  tab: string;
  author: string;
  time: string;
  avatar: string;
  tag?: ClubPostTag;
  title: string;
  text: string;
  likes: number;
  comments: number;
  views: number | null;
  cta?: string;
  photo?: { emoji: string; color: string };
}

/**
 * То, что реально приходит из ClubComposeModal в addClubPost(): только то,
 * что вводит пользователь, — остальные поля (id/author/time/avatar/счётчики)
 * addClubPost() подставляет сама.
 */
export type ClubPostDraft = Partial<Omit<ClubPost, "tab" | "title" | "text">> &
  Pick<ClubPost, "tab" | "title" | "text">;

/** Один размер карточки-варианта вида в витрине — см. FISH_CATALOG_SEED. */
export interface FishCatalogSize {
  id: string;
  cm: string | null;
  price: number;
}

/** Карточка-вариант (окрас/порода) вида в витрине — см. FISH_CATALOG_SEED. */
export interface FishCatalogVariant {
  id: string;
  name: string;
  photo: string | null;
  sizes: FishCatalogSize[];
  badges?: string[];
}

/** Витрина одного вида: список карточек-вариантов. */
export interface FishCatalogEntry {
  variants: FishCatalogVariant[];
}

/** Правки админа поверх FISH_CATALOG_SEED — хранятся в localStorage по FISH_CATALOG_KEY. */
export type CatalogOverrides = Record<string, FishCatalogEntry>;

/** Остатки, выставленные продавцом — хранятся в localStorage по FISH_STOCK_KEY. */
export type StockOverrides = Record<string, number>;

// Leaflet подключается динамически через <script> (см. MapPicker) — типов
// пакета в проекте нет, поэтому объявляем минимальный global, чтобы
// window.L не считался ошибкой типов, а не тащим @types/leaflet ради
// одного использования.
declare global {
  interface Window {
    L?: any;
  }
}

/** Имя иконки из набора Icon — см. функцию Icon(). */
export type IconName =
  | "home" | "fish" | "cart" | "doctor" | "ai" | "person" | "aquarium" | "box"
  | "heart" | "repeat" | "gift" | "chevron" | "back" | "settings" | "link"
  | "group" | "globe" | "upgrade" | "bell" | "search" | "pin" | "star" | "close"
  | "plus" | "camera" | "edit" | "chart" | "truck" | "water";
