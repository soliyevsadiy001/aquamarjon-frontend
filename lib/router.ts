import { useCallback, useEffect, useRef, useState } from "react";
import type { Screen } from "../App";

// ------------------------------------------------------------------
// Роутинг Mini App через хэш URL (#/screen?fish=id), НЕ через pathname.
//
// Почему хэш, а не history.pushState с "настоящими" путями типа /catalog:
// vite.config.ts собирает бандл с base: "./" — приложение может быть
// отдано с любого статического хостинга без серверных SPA-рерайтов
// (GitHub Pages, поддиректория и т.п.). Обновление страницы на пути
// вроде /catalog там просто 404-нется, а хэш всегда открывает один и
// тот же index.html, после чего JS сам восстанавливает экран по хэшу —
// это и есть требование "шер-ссылка должна работать при свежем заходе",
// а не только при переходе внутри уже открытого приложения.
//
// Каждый вызов navigate()/setFishId() делает history.pushState с
// собственным счётчиком глубины (navDepth) в state записи истории.
// Настоящий "назад" (свайп, аппаратная кнопка, программный
// history.back()) обрабатывается через popstate, где мы читаем
// navDepth из state той записи, на которую попали — это надёжнее, чем
// вести собственный счётчик вручную, потому что учитывает и "вперёд" тоже.

export interface RouteState {
  screen: Screen;
  fishId: string | null;
}

const VALID_SCREENS: Screen[] = [
  "landing", "quiz", "city", "home", "catalog", "doctor",
  "diary", "club", "seller", "courier", "admin", "delivery", "profile",
];

function parseHash(hash: string): RouteState {
  const raw = hash.replace(/^#\/?/, "");
  const [screenPart, queryPart] = raw.split("?");
  const screen = (VALID_SCREENS as string[]).includes(screenPart) ? (screenPart as Screen) : "landing";
  let fishId: string | null = null;
  if (queryPart) {
    fishId = new URLSearchParams(queryPart).get("fish");
  }
  return { screen, fishId };
}

function buildHash(screen: Screen, fishId: string | null): string {
  let h = `#/${screen}`;
  if (fishId) h += `?fish=${encodeURIComponent(fishId)}`;
  return h;
}

function buildUrl(screen: Screen, fishId: string | null): string {
  return window.location.pathname + window.location.search + buildHash(screen, fishId);
}

/** Строит абсолютную ссылку на конкретный экран/карточку — для кнопки "Поделиться". */
export function buildShareUrl(screen: Screen, fishId?: string | null): string {
  return `${window.location.origin}${window.location.pathname}${buildHash(screen, fishId ?? null)}`;
}

interface HistoryEntryState {
  navDepth: number;
}

export function useAppRouter(defaultScreen: Screen) {
  const [route, setRoute] = useState<RouteState & { depth: number }>(() => {
    const parsed = window.location.hash ? parseHash(window.location.hash) : { screen: defaultScreen, fishId: null };
    const existingState = window.history.state as HistoryEntryState | null;
    return { ...parsed, depth: existingState && typeof existingState.navDepth === "number" ? existingState.navDepth : 0 };
  });

  const routeRef = useRef(route);
  routeRef.current = route;

  useEffect(() => {
    // Первая запись в истории тоже должна нести наш navDepth, иначе
    // "назад" на первом же шаге не будет знать глубину, с которой стартовали
    // (актуально при заходе по шер-ссылке сразу на какой-то экран).
    if (!window.history.state || typeof (window.history.state as HistoryEntryState).navDepth !== "number") {
      window.history.replaceState({ navDepth: route.depth } as HistoryEntryState, "", buildUrl(route.screen, route.fishId));
    }

    function onPopState(e: PopStateEvent) {
      const parsed = parseHash(window.location.hash);
      const state = e.state as HistoryEntryState | null;
      const depth = state && typeof state.navDepth === "number" ? state.navDepth : 0;
      setRoute({ ...parsed, depth });
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const push = useCallback((screen: Screen, fishId: string | null) => {
    const nextDepth = routeRef.current.depth + 1;
    window.history.pushState({ navDepth: nextDepth } as HistoryEntryState, "", buildUrl(screen, fishId));
    setRoute({ screen, fishId, depth: nextDepth });
  }, []);

  /** Переход на другой экран. По умолчанию сбрасывает fishId (глубокая ссылка на
   *  карточку осмысленна только внутри каталога) — передайте fishId явно, если
   *  его нужно сохранить (например, при возврате из CityPicker на каталог). */
  const navigate = useCallback((screen: Screen, opts?: { fishId?: string | null }) => {
    const fishId = opts && "fishId" in opts ? (opts.fishId ?? null) : null;
    if (screen === routeRef.current.screen && fishId === routeRef.current.fishId) return;
    push(screen, fishId);
  }, [push]);

  /** Открыть/закрыть карточку рыбы, не меняя текущий экран. */
  const setFishId = useCallback((fishId: string | null) => {
    if (fishId === routeRef.current.fishId) return;
    push(routeRef.current.screen, fishId);
  }, [push]);

  const goBack = useCallback(() => {
    if (routeRef.current.depth > 0) window.history.back();
  }, []);

  return {
    screen: route.screen,
    fishId: route.fishId,
    canGoBack: route.depth > 0,
    navigate,
    setFishId,
    goBack,
  };
}
