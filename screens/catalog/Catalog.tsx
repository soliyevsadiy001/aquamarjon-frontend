import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "../../theme";
import type { CartItem, Fish, Order, Region } from "../../types";
import { AppleEmoji } from "../../components/ui/AppleEmoji";
import { Icon } from "../../components/ui/Icon";
import { Sticker } from "../../components/ui/Sticker";
import { Toast } from "../../components/ui/Toast";
import { FISH_DB, getMultiVariantSpeciesIds } from "../../data/fish";
import { ALL_PRODUCTS, CATEGORIES, TYPE_TABS } from "../../data/products";
import { checkCompatibility, formatSum, highlightMatch } from "../../lib/catalog-utils";
import { PENDING_DIARY_TANK_KEY, buildTankDraftFromCart } from "../../lib/diary-stats";
import { buildShareUrl } from "../../lib/router";
import { readLocal, writeLocal } from "../../lib/storage";
import { AIChatWidget } from "./AIChatWidget";
import { AquariumVisualizer } from "./AquariumVisualizer";
import { CartDrawer } from "./CartDrawer";
import { CompareModal } from "./CompareModal";
import { FishCard } from "./FishCard";
import { FishDetail } from "./FishDetail";
import { PostOrderScreen } from "./PostOrderScreen";
import { SpeciesGallery } from "./SpeciesGallery";
import { Checkout } from "../checkout/Checkout";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { minHeight: "100vh", background: COLORS.bg, color: COLORS.text, paddingBottom: 70 } as const;
const __style2 = { padding: "16px 16px 10px", position: "sticky", top: 0, background: "#08131Fcc", backdropFilter: "blur(8px)", zIndex: 50 } as const;
const __style3 = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } as const;
const __style4 = { background: "none", border: "none", color: COLORS.soft, fontSize: 13, cursor: "pointer" } as const;
const __style5 = { display: "flex", gap: 6, marginBottom: 10 } as const;
const __style6 = { position: "relative" } as const;
const __style7 = {
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 80,
              background: "#0D2030", border: `1px solid ${COLORS.border}`,
              borderRadius: "0 0 12px 12px", overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              marginTop: 2,
            } as const;
const __style8 = {
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", cursor: "pointer",
                    borderBottom: `1px solid ${COLORS.border}`,
                  } as const;
const __style9 = { flex: 1 } as const;
const __style10 = { fontSize: 13, fontWeight: 600 } as const;
const __style11 = { fontSize: 11, color: COLORS.muted, fontStyle: "italic" } as const;
const __style12 = { fontSize: 12, color: COLORS.amber, fontWeight: 700 } as const;
const __style13 = {
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: COLORS.muted, fontSize: 16, cursor: "pointer",
              } as const;
const __style14 = { display: "flex", gap: 6, marginTop: 10, alignItems: "center" } as const;
const __style15 = { overflowX: "auto", display: "flex", gap: 6, flex: 1, paddingBottom: 2 } as const;
const __style16 = {
            background: "#0D2030", border: `1px solid ${COLORS.border}`,
            borderRadius: 14, padding: "14px", marginTop: 8,
          } as const;
const __style17 = { marginBottom: 14 } as const;
const __style18 = { display: "flex", justifyContent: "space-between", marginBottom: 6 } as const;
const __style19 = { fontSize: 12, fontWeight: 700, color: COLORS.soft } as const;
const __style20 = { fontSize: 12, color: COLORS.teal, fontWeight: 700 } as const;
const __style21 = { width: "100%", accentColor: COLORS.teal } as const;
const __style22 = { display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.muted, marginTop: 2 } as const;
const __style23 = { width: "100%", accentColor: COLORS.amber } as const;
const __style24 = {
                  marginTop: 10, background: "none", border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, padding: "5px 12px", color: COLORS.muted,
                  fontSize: 11, cursor: "pointer", width: "100%",
                } as const;
const __style25 = { display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 2 } as const;
const __style26 = {
              width: "100%",
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
              background: "linear-gradient(90deg, #0F2A26, #102433)",
              border: `1px solid ${COLORS.teal}`,
              borderRadius: 14,
              padding: "12px 14px",
              color: COLORS.text,
              cursor: "pointer",
            } as const;
const __style27 = { fontSize: 22 } as const;
const __style28 = { fontSize: 13.5, fontWeight: 700 } as const;
const __style29 = { fontSize: 11.5, color: COLORS.soft } as const;
const __style30 = { color: COLORS.teal, fontSize: 18 } as const;
const __style31 = {
          margin: "0 16px 4px",
          background: "linear-gradient(135deg, #071C14, #071828)",
          border: "1px solid #00C9B133",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        } as const;
const __style32 = { fontSize: 18 } as const;
const __style33 = { fontSize: 12, fontWeight: 700, color: COLORS.teal } as const;
const __style34 = { fontSize: 11, color: COLORS.muted, marginTop: 1 } as const;
const __style35 = { background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "4px 10px", color: COLORS.muted, fontSize: 11, cursor: "pointer" } as const;
const __style36 = { padding: "0 16px" } as const;
const __style37 = {
          margin: "0 16px 4px",
          background: "linear-gradient(90deg, #1A0E28, #102433)",
          border: "1px solid #F0A93C55",
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        } as const;
const __style38 = { display: "flex", gap: -4 } as const;
const __style39 = { marginRight: -4, display: "inline-block" } as const;
const __style40 = { fontSize: 12, fontWeight: 700, color: COLORS.amber } as const;
const __style41 = { fontSize: 11, color: COLORS.soft, marginTop: 1 } as const;
const __style42 = { background: COLORS.amber, border: "none", borderRadius: 8, padding: "6px 12px", color: COLORS.bg, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } as const;
const __style43 = {
          margin: "0 16px 4px",
          background: "#0D2030", border: `1px solid ${COLORS.border}`,
          borderRadius: 14, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        } as const;
const __style44 = { flex: 1, fontSize: 11.5, color: COLORS.soft } as const;
const __style45 = { background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "4px 8px", color: COLORS.muted, fontSize: 11, cursor: "pointer" } as const;
const __style46 = { display: "flex", gap: 6, flexWrap: "wrap", padding: "0 16px 4px" } as const;
const __style47 = {
                display: "flex", alignItems: "center", gap: 5,
                background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 999,
                padding: "4px 10px", color: COLORS.soft, fontSize: 11, fontWeight: 600, cursor: "pointer",
              } as const;
const __style48 = { color: COLORS.muted } as const;
const __style49 = { padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } as const;
const __style50 = { gridColumn: "1/-1", textAlign: "center", marginTop: 30, padding: "0 12px" } as const;
const __style51 = { fontSize: 32, marginBottom: 8 } as const;
const __style52 = { color: COLORS.soft, fontSize: 13.5, marginBottom: 14 } as const;
const __style53 = {
                  background: COLORS.teal, border: "none", borderRadius: 10,
                  padding: "8px 18px", color: COLORS.bg, fontSize: 13, fontWeight: 700, cursor: "pointer",
                } as const;
const __style54 = { marginTop: 16 } as const;
const __style55 = { fontSize: 11.5, color: COLORS.muted, marginBottom: 8 } as const;
const __style56 = { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" } as const;
const __style57 = {
                        background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 999,
                        padding: "6px 14px", color: COLORS.soft, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      } as const;
const __style58 = {
          position: "fixed",
          bottom: 14,
          left: 12,
          right: 12,
          background: "rgba(16, 28, 40, 0.55)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 26,
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          zIndex: 90,
        } as const;
const __style59 = { position: "relative", display: "flex", justifyContent: "center", marginBottom: 3 } as const;
const __style60 = {
                    position: "absolute",
                    top: -6,
                    right: -8,
                    background: COLORS.teal,
                    color: COLORS.bg,
                    fontSize: 9,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: "1px 5px",
                  } as const;


export interface CatalogProps {
  region: Region;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onChangeRegion?: () => void;
  onOpenConfigurator: () => void;
  onOpenProfile: () => void;
  onOpenDoctor: () => void;
  onOpenHome?: () => void;
  onOrderPlaced: (order: Order) => void;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
  externalCartOpen?: boolean;
  onExternalCartClose?: () => void;
  quizFilter?: any;
  onClearQuizFilter?: () => void;
  wishlist: Fish[];
  onToggleWishlist: (fish: Fish) => void;
  subscriptions: any[];
  onSubscribe: (fish: Fish, weeks?: number) => void;
  initialSearch?: string | null;
  onClearInitialSearch?: () => void;
  initialCategory?: string | null;
  onClearInitialCategory?: () => void;
  filterSeed?: any;
  onOpenDiary: () => void;
  initialToast?: any;
  onClearInitialToast?: () => void;
  /** id рыбы из URL (#/catalog?fish=id) — открыть карточку сразу при заходе по шер-ссылке. */
  initialFishId?: string | null;
  /** Вызывается при открытии/закрытии карточки — родитель синхронизирует это в URL. */
  onOpenFishChange?: (fishId: string | null) => void;
}

export function Catalog({ region, cart, setCart, onChangeRegion, onOpenConfigurator, onOpenProfile, onOpenDoctor, onOpenHome, onOrderPlaced, hideHeader, hideBottomNav, externalCartOpen, onExternalCartClose, quizFilter, onClearQuizFilter, wishlist, onToggleWishlist, subscriptions, onSubscribe, initialSearch, onClearInitialSearch, initialCategory, onClearInitialCategory, filterSeed, onOpenDiary, initialToast, onClearInitialToast, initialFishId, onOpenFishChange }: CatalogProps) {
  const [search, setSearch] = useState(initialSearch || "");
  // Инпут обновляется мгновенно (search), а фильтрация каталога — по debounced-значению,
  // чтобы не пересчитывать сетку на каждый keystroke на большом каталоге.
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || "");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setDebouncedSearch(initialSearch);
      onClearInitialSearch && onClearInitialSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [productType, setProductType] = useState("fish");
  const [cat, setCat] = useState("all");
  useEffect(() => {
    if (initialCategory) {
      setCat(initialCategory);
      onClearInitialCategory && onClearInitialCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory]);
  // Сид фильтра для встроенного каталога на главной — пересчитывается на каждый клик
  // по категории (даже повторный), поэтому передаём готовый объект с токеном.
  useEffect(() => {
    if (filterSeed) {
      setSearch(filterSeed.search || "");
      setCat(filterSeed.cat || "all");
      setProductType("fish");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSeed]);
  const [sort, setSort] = useState("popular"); // popular | price_asc | price_desc | rating | new
  const [tankVolume, setTankVolume] = useState(0); // 0 = не фильтровать
  const [priceMax, setPriceMax] = useState(0); // 0 = не фильтровать
  const [showFilters, setShowFilters] = useState(false);
  const [openFish, setOpenFish] = useState(null);
  const [openSpeciesId, setOpenSpeciesId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [postOrderCart, setPostOrderCart] = useState(null); // для экрана «Пока везут»
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [compareList, setCompareList] = useState([]); // до 4 рыб для сравнения
  const [compareOpen, setCompareOpen] = useState(false);
  const toastTimer = useRef(null);
  // Разовая подсказка про кнопку «⚖️ Сравнить» на карточке — показываем один раз,
  // пока пользователь ни разу не пробовал сравнение, и прячем после первого клика или закрытия.
  const [showCompareHint, setShowCompareHint] = useState(() => !readLocal("aqua_seen_compare_hint", false));
  function dismissCompareHint() {
    setShowCompareHint(false);
    writeLocal("aqua_seen_compare_hint", true);
  }

  useEffect(() => {
    if (externalCartOpen) { setCartOpen(true); onExternalCartClose && onExternalCartClose(); }
  }, [externalCartOpen]);

  // Suggestions for autocomplete
  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return ALL_PRODUCTS.filter(f =>
      f.type === productType && (
        f.name.toLowerCase().includes(q) ||
        (f.latin && f.latin.toLowerCase().includes(q)) ||
        (f.badges && f.badges.some(b => b.toLowerCase().includes(q)))
      )
    ).slice(0, 5);
  }, [search, productType]);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter((f) => {
      if (f.type !== productType) return false;
      if (debouncedSearch && !f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !(f.latin && f.latin.toLowerCase().includes(debouncedSearch.toLowerCase()))) return false;
      if (productType !== "fish") return true;
      if (quizFilter && !debouncedSearch && cat === "all") {
        const fitsVolume = quizFilter.maxVolume == null || f.minVolume <= quizFilter.maxVolume;
        const fitsDiff = !quizFilter.difficulties || quizFilter.difficulties.includes(f.difficulty);
        const fitsGoal = !quizFilter.goals || quizFilter.goals.some(g => f.goal.includes(g));
        if (!fitsVolume || !fitsDiff || !fitsGoal) return false;
      }
      // Фильтр по объёму аквариума
      if (tankVolume > 0 && f.minVolume && f.minVolume > tankVolume) return false;
      // Фильтр по цене
      if (priceMax > 0 && f.price > priceMax) return false;
      if (cat === "all") return true;
      if (cat === "peaceful") return f.temper === "peaceful";
      if (cat === "aggressive") return f.temper === "aggressive";
      if (cat === "kids") return f.goal && f.goal.includes("kids");
      if (cat === "local") return f.origin === "local";
      if (cat === "import") return f.origin === "import";
      return true;
    });
    // Сортировка
    list = [...list].sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return b.reviews - a.reviews;
      return 0;
    });
    return list;
  }, [debouncedSearch, cat, productType, quizFilter, sort, tankVolume, priceMax]);

  // Карточки для сетки каталога: карточки одного вида (несколько
  // окрасов/пород — гуппи, неон и т.п.) схлопываются в одну карточку
  // «вид рыбы», по клику на которую открывается галерея его карточек.
  const displayItems = useMemo(() => {
    if (productType !== "fish") return filtered;
    const multiVariantIds = getMultiVariantSpeciesIds();
    const out = [];
    const seenSpecies = new Set();
    for (const f of filtered) {
      if (!multiVariantIds.has(f.speciesId)) { out.push(f); continue; }
      if (seenSpecies.has(f.speciesId)) continue;
      seenSpecies.add(f.speciesId);
      const siblings = filtered.filter((x) => x.speciesId === f.speciesId);
      const minPrice = Math.min(...siblings.map((x) => x.price));
      const withPhoto = siblings.find((x) => x.photo);
      const variantIds = new Set(siblings.map((x) => x.variantId));
      out.push({
        ...f,
        id: f.speciesId,
        isSpeciesGroup: true,
        name: f.speciesName,
        price: minPrice,
        photo: withPhoto ? withPhoto.photo : null,
        variantsCount: variantIds.size,
      });
    }
    return out;
  }, [filtered, productType]);

  // Категории, где есть результаты по текущему поиску (без учёта cat/объёма/цены) —
  // используется для подсказки «попробуйте» в пустом состоянии каталога.
  const categoriesWithResults = useMemo(() => {
    if (productType !== "fish") return [];
    return CATEGORIES.filter((c) => {
      if (c.id === "all" || c.id === cat) return false;
      return ALL_PRODUCTS.some((f) => {
        if (f.type !== "fish") return false;
        if (debouncedSearch && !f.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
            !(f.latin && f.latin.toLowerCase().includes(debouncedSearch.toLowerCase()))) return false;
        if (c.id === "peaceful") return f.temper === "peaceful";
        if (c.id === "aggressive") return f.temper === "aggressive";
        if (c.id === "kids") return f.goal && f.goal.includes("kids");
        if (c.id === "local") return f.origin === "local";
        if (c.id === "import") return f.origin === "import";
        return false;
      });
    }).slice(0, 3);
  }, [debouncedSearch, cat, productType]);

  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  // Тост, переданный извне (например, после «Повторить заказ» из профиля) —
  // показываем один раз при монтировании и сразу сообщаем родителю, что забрали.
  useEffect(() => {
    if (initialToast) {
      showToast(initialToast.text, initialToast.type || "ok");
      onClearInitialToast && onClearInitialToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToast]);

  const addToCart = useCallback((fish) => {
    const compat = checkCompatibility(fish, cart);
    if (compat.level === "bad") {
      showToast(`⚠️ ${fish.name.split(" ")[0]} несовместим с тем что в корзине`, "bad");
      return;
    }
    setCart((c) => [...c, fish]);
    showToast(`✅ ${fish.name.split(" ")[0]} добавлена в корзину`, "ok");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const removeFromCart = useCallback((idx) => {
    setCart((c) => c.filter((_, i) => i !== idx));
  }, [setCart]);

  const toggleCompare = useCallback((fish) => {
    if (showCompareHint) dismissCompareHint();
    setCompareList((list) => {
      if (list.some((f) => f.id === fish.id)) return list.filter((f) => f.id !== fish.id);
      if (list.length >= 4) { showToast("⚖️ Можно сравнить максимум 4 рыбы", "bad"); return list; }
      return [...list, fish];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompareHint]);

  const countById = useMemo(() => {
    const m = {};
    cart.forEach((f) => (m[f.id] = (m[f.id] || 0) + 1));
    return m;
  }, [cart]);

  // Раньше checkCompatibility(f, cart) вызывался инлайн в JSX на каждый рендер
  // и создавал новый объект для каждой карточки — это ломало React.memo(FishCard).
  // Теперь считаем один раз на весь список и передаём стабильные ссылки по id.
  const compatById = useMemo(() => {
    const m = {};
    for (const f of displayItems) m[f.id] = checkCompatibility(f, cart);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayItems, cart]);

  const handleOpenFish = useCallback((fish) => {
    if (fish.isSpeciesGroup) setOpenSpeciesId(fish.speciesId);
    else { setOpenFish(fish); onOpenFishChange?.(fish.id); }
  }, [onOpenFishChange]);

  // Восстановление карточки из URL: при заходе по шер-ссылке (#/catalog?fish=id)
  // и при навигации браузерной/Telegram-кнопкой "назад" — initialFishId меняется
  // извне (не через handleOpenFish), и нужно завести/закрыть openFish в ответ,
  // не сообщая об этом родителю повторно (иначе будет пинг-понг push↔push).
  useEffect(() => {
    if (initialFishId) {
      if (!openFish || openFish.id !== initialFishId) {
        const found = FISH_DB.find((f) => f.id === initialFishId);
        if (found) setOpenFish(found);
      }
    } else if (openFish) {
      setOpenFish(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFishId]);

  return (
    <div style={__style1}>
      {/* header */}
      {!hideHeader && (
      <div style={__style2}>
        <div style={__style3}>
          <button
            onClick={onChangeRegion}
            style={__style4}
          >
            📍 {region} ▾
          </button>
        </div>

        <div style={__style5}>
          {TYPE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setProductType(t.id);
                setCat("all");
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: productType === t.id ? COLORS.greenBg : COLORS.panel,
                border: `1px solid ${productType === t.id ? COLORS.teal : COLORS.border}`,
                borderRadius: 12,
                padding: "8px 4px",
                color: productType === t.id ? COLORS.teal : COLORS.soft,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Sticker e={t.icon} size={32} />
              {t.label}
            </button>
          ))}
        </div>

        <div style={__style6}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder={`🔍 Найти по названию или латыни...`}
            style={{
              width: "100%",
              background: COLORS.panel,
              border: "1px solid " + (searchFocused ? COLORS.teal : COLORS.border),
              borderRadius: 12,
              padding: "10px 14px",
              color: COLORS.text,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
          />
          {/* Autocomplete dropdown */}
          {searchFocused && suggestions.length > 0 && (
            <div style={__style7}>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onMouseDown={() => { setSearch(s.name); setSearchFocused(false); }}
                  style={__style8}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.panel}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Sticker e={s.img} size={38} />
                  <div style={__style9}>
                    <div style={__style10}>{highlightMatch(s.name, search)}</div>
                    {s.latin && <div style={__style11}>{highlightMatch(s.latin, search)}</div>}
                  </div>
                  <span style={__style12}>{formatSum(s.price)}</span>
                </div>
              ))}
            </div>
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              style={__style13}
            >✕</button>
          )}
        </div>

        {/* Sort + Filter row */}
        <div style={__style14}>
          <div style={__style15}>
            {[
              { id: "popular", label: "🔥 Популярные" },
              { id: "rating", label: "⭐ Рейтинг" },
              { id: "price_asc", label: "💰 Дешевле" },
              { id: "price_desc", label: "💎 Дороже" },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                style={{
                  whiteSpace: "nowrap",
                  background: sort === s.id ? "#00C9B122" : COLORS.panel,
                  color: sort === s.id ? COLORS.teal : COLORS.soft,
                  border: "1px solid " + (sort === s.id ? COLORS.teal : COLORS.border),
                  borderRadius: 999, padding: "5px 12px",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >{s.label}</button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            aria-label={showFilters ? "Скрыть фильтры" : "Показать фильтры"}
            aria-expanded={showFilters}
            style={{
              background: (tankVolume > 0 || priceMax > 0) ? "#00C9B122" : COLORS.panel,
              border: "1px solid " + ((tankVolume > 0 || priceMax > 0) ? COLORS.teal : COLORS.border),
              borderRadius: 10, padding: "6px 10px",
              color: (tankVolume > 0 || priceMax > 0) ? COLORS.teal : COLORS.soft,
              fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
            }}
          >⚙️ {(tankVolume > 0 || priceMax > 0) ? "•" : ""}</button>
        </div>

        {/* Expandable filters panel */}
        {showFilters && productType === "fish" && (
          <div style={__style16}>
            {/* Объём аквариума */}
            <div style={__style17}>
              <div style={__style18}>
                <span style={__style19}>🪣 Объём аквариума</span>
                <span style={__style20}>
                  {tankVolume === 0 ? "Любой" : `до ${tankVolume} л`}
                </span>
              </div>
              <input
                type="range" min="0" max="300" step="20" value={tankVolume}
                onChange={e => setTankVolume(Number(e.target.value))}
                style={__style21}
              />
              <div style={__style22}>
                <span>Любой</span>
                {[40,80,150,300].map(v => <span key={v}>{v}л</span>)}
              </div>
            </div>
            {/* Цена */}
            <div>
              <div style={__style18}>
                <span style={__style19}>💰 Максимум цена</span>
                <span style={__style12}>
                  {priceMax === 0 ? "Любая" : formatSum(priceMax)}
                </span>
              </div>
              <input
                type="range" min="0" max="200000" step="5000" value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={__style23}
              />
              <div style={__style22}>
                <span>Любая</span>
                {[25000,50000,100000,200000].map(v => <span key={v}>{v/1000}к</span>)}
              </div>
            </div>
            {(tankVolume > 0 || priceMax > 0) && (
              <button
                onClick={() => { setTankVolume(0); setPriceMax(0); }}
                style={__style24}
              >Сбросить фильтры</button>
            )}
          </div>
        )}
        {productType === "fish" && (
          <div style={__style25}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                style={{
                  whiteSpace: "nowrap",
                  background: cat === c.id ? COLORS.teal : COLORS.panel,
                  color: cat === c.id ? COLORS.bg : COLORS.soft,
                  border: "1px solid " + (cat === c.id ? COLORS.teal : COLORS.border),
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {productType === "fish" && (
          <button
            onClick={onOpenConfigurator}
            style={__style26}
          >
            <span style={__style27}>🤖</span>
            <span style={__style9}>
              <div style={__style28}>Не знаете с чего начать?</div>
              <div style={__style29}>AI подберёт рыб под ваш аквариум за 2 минуты</div>
            </span>
            <span style={__style30}>→</span>
          </button>
        )}
      </div>
      )}

      {/* Баннер активного квиз-фильтра */}
      {quizFilter && productType === "fish" && !debouncedSearch && cat === "all" && (
        <div style={__style31}>
          <span style={__style32}>🎯</span>
          <div style={__style9}>
            <div style={__style33}>Каталог подобран по вашему квизу</div>
            <div style={__style34}>
              {filtered.length} рыб подходят под ваш аквариум и опыт
            </div>
          </div>
          <button
            onClick={() => { onClearQuizFilter && onClearQuizFilter(); }}
            style={__style35}
          >
            Сбросить
          </button>
        </div>
      )}

      {/* Визуализация аквариума — появляется когда 2+ рыбы в корзине */}
      {productType === "fish" && (
        <div style={__style36}>
          <AquariumVisualizer cart={cart} allFish={FISH_DB} />
        </div>
      )}

      {/* Трей режима сравнения */}
      {compareList.length > 0 && (
        <div style={__style37}>
          <div style={__style38}>
            {compareList.map((f) => (
              <span key={f.id} style={__style39}><AppleEmoji e={f.img} size={18} /></span>
            ))}
          </div>
          <div style={__style9}>
            <div style={__style40}>⚖️ Сравнение ({compareList.length}/4)</div>
            <div style={__style41}>
              {compareList.length < 2 ? "Выберите ещё одну рыбу" : "Готово к сравнению"}
            </div>
          </div>
          {compareList.length >= 2 && (
            <button onClick={() => setCompareOpen(true)} style={__style42}>Сравнить</button>
          )}
          <button onClick={() => setCompareList([])} style={__style35} aria-label="Очистить сравнение">✕</button>
        </div>
      )}

      {/* Разовая подсказка про сравнение рыб — только пока пользователь ей не пользовался */}
      {productType === "fish" && showCompareHint && compareList.length === 0 && filtered.length > 0 && (
        <div style={__style43}>
          <span style={__style32}>⚖️</span>
          <div style={__style44}>
            Нажмите на значок «⚖️» на карточке, чтобы сравнить до 4 рыб между собой
          </div>
          <button
            onClick={dismissCompareHint}
            aria-label="Скрыть подсказку"
            style={__style45}
          >Понятно</button>
        </div>
      )}

      {/* Чипсы активных фильтров — видно, что применено, без открытия панели заново */}
      {(debouncedSearch || cat !== "all" || tankVolume > 0 || priceMax > 0) && (
        <div style={__style46}>
          {debouncedSearch && (
            <button
              onClick={() => setSearch("")}
              aria-label="Убрать поисковый запрос"
              style={__style47}
            >🔍 «{debouncedSearch}» <span style={__style48}>✕</span></button>
          )}
          {cat !== "all" && (
            <button
              onClick={() => setCat("all")}
              aria-label="Сбросить категорию"
              style={__style47}
            >{CATEGORIES.find(c => c.id === cat)?.label || cat} <span style={__style48}>✕</span></button>
          )}
          {tankVolume > 0 && (
            <button
              onClick={() => setTankVolume(0)}
              aria-label="Сбросить фильтр по объёму"
              style={__style47}
            >🪣 до {tankVolume} л <span style={__style48}>✕</span></button>
          )}
          {priceMax > 0 && (
            <button
              onClick={() => setPriceMax(0)}
              aria-label="Сбросить фильтр по цене"
              style={__style47}
            >💰 до {formatSum(priceMax)} <span style={__style48}>✕</span></button>
          )}
        </div>
      )}

      {/* grid */}
      <div style={__style49}>
        {displayItems.map((f) => (
          <FishCard
            key={f.id}
            fish={f}
            compat={compatById[f.id]}
            inCart={countById[f.id] || 0}
            onOpen={handleOpenFish}
            onAdd={addToCart}
            onCompare={toggleCompare}
            inCompare={compareList.some((c) => c.id === f.id)}
            isFav={wishlist ? wishlist.some((w) => w.id === f.id) : false}
            onToggleFav={onToggleWishlist}
          />
        ))}
        {filtered.length === 0 && (
          <div style={__style50}>
            <div style={__style51}>🔍</div>
            <p style={__style52}>
              Ничего не найдено — попробуйте другой запрос или сбросьте фильтры
            </p>
            {(debouncedSearch || cat !== "all" || tankVolume > 0 || priceMax > 0) && (
              <button
                onClick={() => { setSearch(""); setCat("all"); setTankVolume(0); setPriceMax(0); }}
                style={__style53}
              >Сбросить всё</button>
            )}
            {categoriesWithResults.length > 0 && (
              <div style={__style54}>
                <div style={__style55}>Может быть, вас заинтересует:</div>
                <div style={__style56}>
                  {categoriesWithResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCat(c.id)}
                      style={__style57}
                    >{c.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* bottom nav */}
      {!hideBottomNav && (
      <div
        style={__style58}
      >
        {[
          ["home", "Главная", onOpenHome],
          ["fish", "Каталог", null],
          ["cart", "Корзина", () => setCartOpen(true)],
          ["doctor", "Доктор", onOpenDoctor],
          ["ai", "AI Подбор", onOpenConfigurator],
        ].map(([icon, label, action], i) => (
          <button
            key={label}
            onClick={action || undefined}
            aria-label={label === "Корзина" && cart.length > 0 ? `Открыть корзину, товаров: ${cart.length}` : undefined}
            style={{
              position: "relative",
              textAlign: "center",
              color: i === 1 ? COLORS.teal : COLORS.muted,
              fontSize: 10.5,
              fontWeight: i === 1 ? 700 : 500,
              background: i === 1 ? "rgba(255,255,255,0.06)" : "none",
              border: "none",
              borderRadius: 14,
              padding: "6px 10px",
              cursor: action ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            <div style={__style59}>
              <Icon name={icon} size={20} />
              {label === "Корзина" && cart.length > 0 && (
                <span
                  style={__style60}
                >
                  {cart.length}
                </span>
              )}
            </div>
            {label}
          </button>
        ))}
      </div>
      )}

      <FishDetail
        fish={openFish}
        compat={openFish ? checkCompatibility(openFish, cart) : { level: "ok" }}
        onClose={() => { setOpenFish(null); onOpenFishChange?.(null); }}
        onAdd={(f) => {
          addToCart(f);
          setOpenFish(null);
          onOpenFishChange?.(null);
        }}
        onShare={(f) => {
          const url = buildShareUrl("catalog", f.id);
          const shareText = `${f.name} — AquaMarjon`;
          const nav: any = navigator;
          if (nav.share) {
            nav.share({ title: shareText, url }).catch(() => {});
          } else if (nav.clipboard?.writeText) {
            nav.clipboard.writeText(url).then(
              () => showToast("🔗 Ссылка скопирована", "ok"),
              () => showToast("Не удалось скопировать ссылку", "bad")
            );
          }
        }}
        onCompare={toggleCompare}
        inCompare={openFish ? compareList.some((c) => c.id === openFish.id) : false}
        isFav={openFish && wishlist ? wishlist.some((w) => w.id === openFish.id) : false}
        onToggleFav={onToggleWishlist}
        onSubscribe={onSubscribe ? (f, weeks) => {
          onSubscribe(f, weeks);
          showToast(`🔁 Подписка на «${f.name.split(" ")[0]}» оформлена`, "ok");
        } : undefined}
        activeSubscription={openFish && subscriptions ? subscriptions.find((s) => s.productId === openFish.id) : null}
      />
      {openSpeciesId && (
        <SpeciesGallery
          speciesId={openSpeciesId}
          allFish={FISH_DB}
          onClose={() => setOpenSpeciesId(null)}
          onOpenVariant={(fish) => { setOpenSpeciesId(null); setOpenFish(fish); onOpenFishChange?.(fish.id); }}
        />
      )}
      {compareOpen && (
        <CompareModal
          fishes={compareList}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareList((l) => l.filter((f) => f.id !== id))}
        />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        region={region}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      {checkoutOpen && (
        <Checkout
          region={region}
          cart={cart}
          setCart={setCart}
          onClose={() => setCheckoutOpen(false)}
          onChangeRegion={() => { setCheckoutOpen(false); onChangeRegion?.(); }}
          onDone={(order) => {
            setCheckoutOpen(false);
            setPostOrderCart([...cart]);
            setCart([]);
            onOrderPlaced(order);
          }}
        />
      )}
      {postOrderCart && (
        <PostOrderScreen
          cart={postOrderCart}
          onClose={() => setPostOrderCart(null)}
          onCreateDiary={onOpenDiary ? (fishItems) => {
            // Передаём дневнику черновик аквариума с автозаполнением рыб из
            // корзины через localStorage — DiaryScreen подхватит его при монтировании.
            writeLocal(PENDING_DIARY_TANK_KEY, buildTankDraftFromCart(fishItems));
            setPostOrderCart(null);
            onOpenDiary();
          } : undefined}
        />
      )}
      <AIChatWidget cart={cart} />
      <Toast toast={toast} />
    </div>
  );
}

/* ============================================================
   Checkout v2 — адрес + оплата
   Новое: SMS-верификация телефона · промокод · inline-валидация
   полей · редактирование корзины (qty) · карта (Leaflet/OSM) ·
   сохранённые адреса · анимированный прогресс · экран загрузки
   ============================================================ */
