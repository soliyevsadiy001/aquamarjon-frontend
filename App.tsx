import React, { Suspense, useEffect, useState } from "react";
import { COLORS } from "./theme";
import type { ClubPost, ClubPostDraft, Role } from "./types";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { OfflineAuthBanner } from "./components/ui/OfflineAuthBanner";
import { OfflineBanner } from "./components/ui/OfflineBanner";
import { CLUB_POSTS } from "./data/club-content";
import { ORDER_STATUSES } from "./data/orders";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useNotifPrefs } from "./hooks/useNotifPrefs";
import { useOrders } from "./hooks/useOrders";
import { useSubscriptions } from "./hooks/useSubscriptions";
import { useWishlist } from "./hooks/useWishlist";
import { tg } from "./lib/api";
import { checkCompatibility } from "./lib/catalog-utils";
import { PENDING_DIARY_TANK_KEY, buildTankDraftFromCart } from "./lib/diary-stats";
import { notifyTelegram } from "./lib/notify";
import { useAppRouter } from "./lib/router";
import { writeLocal } from "./lib/storage";
import { ChangePasswordScreen } from "./screens/auth/ChangePasswordScreen";
import { ContactSupportScreen } from "./screens/auth/ContactSupportScreen";
import { LoginScreen } from "./screens/auth/LoginScreen";
import { Catalog } from "./screens/catalog/Catalog";
import { ClubScreen } from "./screens/club/ClubScreen";
import { GlobalConfigurator } from "./screens/configurator/GlobalConfigurator";
import { DeliveryTracker } from "./screens/delivery/DeliveryTracker";
import { DiaryScreen } from "./screens/diary/DiaryScreen";
import { CityPicker } from "./screens/home/CityPicker";
import { HomeHero } from "./screens/home/HomeHero";
import { HomeScreen } from "./screens/home/HomeScreen";
import { Landing } from "./screens/home/Landing";
import { OnboardingQuiz } from "./screens/home/OnboardingQuiz";
import { Profile } from "./screens/profile/Profile";

// ------------------------------------------------------------------
// Ленивая загрузка редко посещаемых экранов (React.lazy + Suspense).
//
// Раньше AdminPanel, SellerCabinet, CourierView и FishDoctorScreen
// импортировались статически прямо здесь — а значит их код (вместе со
// всеми их вложенными компонентами: таблицы AdminPanel, флоу склада
// продавца, трекинг курьера, шаги AI-доктора) попадал в главный бандл,
// который скачивают ВСЕ пользователи ещё до первого рендера, включая
// подавляющее большинство — обычных покупателей, которые никогда не
// откроют admin/seller/courier. React.lazy откладывает загрузку чанка
// каждого экрана до момента, когда пользователь на него реально
// переходит; <Suspense fallback=...> ниже показывает лёгкий индикатор
// на время скачивания чанка (обычно доли секунды).
//
// HomeScreen/Catalog/Profile и другие экраны на основном пути покупки
// остаются статическими импортами намеренно — они и так нужны почти
// сразу, лениво грузить их значило бы просто передвинуть спиннер с
// первого экрана на второй, ничего не выиграв.
const AdminPanel = React.lazy(() =>
  import("./screens/admin/AdminPanel").then((m) => ({ default: m.AdminPanel }))
);
const SellerCabinet = React.lazy(() =>
  import("./screens/seller/SellerCabinet").then((m) => ({ default: m.SellerCabinet }))
);
const CourierView = React.lazy(() =>
  import("./screens/delivery/CourierView").then((m) => ({ default: m.CourierView }))
);
const FishDoctorScreen = React.lazy(() =>
  import("./screens/doctor/FishDoctorScreen").then((m) => ({ default: m.FishDoctorScreen }))
);

// Общий фолбэк на время загрузки чанка ленивого экрана — единообразный
// на весь экран, чтобы не дублировать разметку в четырёх местах ниже.
function ScreenLoadingFallback() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, fontSize: 14 }}>
      Загрузка…
    </div>
  );
}

export type Screen =
  | "landing"
  | "quiz"
  | "city"
  | "home"
  | "catalog"
  | "doctor"
  | "diary"
  | "club"
  | "seller"
  | "courier"
  | "admin"
  | "delivery"
  | "profile";

// Единая цветовая палитра (тёмная тема seller/courier-кабинетов). Раньше этот
// объект был скопирован дословно в 4 местах (ContactSupportScreen, LoginScreen,
// ChangePasswordScreen, AdminPanel) — при смене бренд-цвета пришлось бы искать
// каждую копию руками. Теперь один источник правды; локальные алиасы `C`/`A`
// в компонентах ниже сохранены, чтобы не переименовывать все обращения к ним.
// THEME теперь живёт в theme.ts (см. импорт COLORS/THEME сверху файла).

// ------------------------------------------------------------
// JWT токен — хранится ТОЛЬКО в памяти (модульная переменная), не в
// localStorage. Раньше токен клался в localStorage, но: (1) loggedInAcc
// и так не восстанавливается из токена при перезагрузке страницы (см.
// `useState(null)` для loggedInAcc в App) — то есть персистентность в
// localStorage не давала реального UX-бенефита (пользователь всё равно
// логинится заново после reload), (2) любой XSS/инжект в WebView мог бы
// прочитать токен из localStorage синхронно и унести его. Хранение в
// памяти даёт то же поведение для пользователя, но токен не переживает
// обновление страницы и не виден через localStorage в devtools.
// Если понадобится «не разлогинивать при обновлении» — правильный путь:
// на бэкенде выдавать короткоживущий токен и на старте приложения
// молча переавторизовываться через tgInitData (Telegram сам подтверждает
// личность пользователя), а не персистить сам токен на клиенте.

export function App() {
  // Экран синхронизирован с #-хэшем URL (см. lib/router.ts) — это даёт
  // шер-ссылки на конкретный экран/карточку и делает физическую кнопку
  // "назад" в Telegram осмысленной (см. useEffect с BackButton ниже).
  // setScreen оставлен как тонкий алиас над router.navigate, чтобы не
  // переписывать три десятка существующих вызовов setScreen(...) по коду.
  const router = useAppRouter("landing");
  const screen = router.screen;
  const setScreen = router.navigate;
  const [region, setRegion] = useState(null);

  // Корзина, избранное, подписки, уведомления и заказы — раньше были
  // 5 парами useState+useEffect(localStorage) прямо здесь; теперь каждая
  // вынесена в свой хук (см. определения выше App()), а App() просто
  // достаёт из них то же самое, что раньше лежало в локальных переменных.
  const [cart, setCart] = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { subscriptions, subscribeToProduct, cancelSubscription, toggleSubscriptionPause } = useSubscriptions();
  const { notifPrefs, updateNotifPref } = useNotifPrefs();
  const { orders, setOrders, addOrder } = useOrders();

  // Авторизация продавца/курьера — раньше 4 независимых useState,
  // теперь один useReducer внутри useAuth() (см. выше App()).
  const auth = useAuth();

  // Telegram Mini App — инициализация
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();           // сообщаем Telegram что приложение готово
      tg.expand();          // разворачиваем на весь экран
      tg.disableVerticalSwipes?.(); // отключаем закрытие свайпом вниз
      // Приложение сверстано в единой тёмной палитре (нет отдельной светлой темы) —
      // явно фиксируем цвет шапки/фона Telegram под неё, чтобы в светлой теме
      // Telegram не было белых полос сверху/снизу вокруг тёмного контента.
      try {
        tg.setHeaderColor?.(COLORS.bg);
        tg.setBackgroundColor?.(COLORS.bg);
      } catch {}
    }
  }, []);

  // Telegram Mini App — физическая/программная кнопка "назад". Показываем её
  // только когда есть куда возвращаться внутри приложения (router.canGoBack),
  // иначе Telegram сам показывает свой стандартный "закрыть" — так пользователь
  // не проваливается в пустой экран и не выходит из Mini App по случайности.
  useEffect(() => {
    const twa = (window as any).Telegram?.WebApp;
    if (!twa?.BackButton) return;
    if (router.canGoBack) twa.BackButton.show();
    else twa.BackButton.hide();
    const handleBack = () => router.goBack();
    twa.BackButton.onClick(handleBack);
    return () => {
      twa.BackButton.offClick?.(handleBack);
    };
  }, [router.canGoBack, router.goBack]);

  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userTanks, setUserTanks] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [quizFilter, setQuizFilter] = useState(null); // фильтр из квиза
  const [clubPosts, setClubPosts] = useState(CLUB_POSTS); // лента Клуба (включая шаринг бейджей)
  const [diaryStats, setDiaryStats] = useState(null); // статистика дневника для рейтинга
  const [catalogSearchSeed, setCatalogSearchSeed] = useState(null); // поиск, переданный из дневника/доктора в каталог
  const [catalogCategorySeed, setCatalogCategorySeed] = useState(null); // категория, выбранная на главной
  const [profileInitialTab, setProfileInitialTab] = useState(null); // вкладка профиля при открытии (напр. избранное)
  const [flashToast, setFlashToast] = useState<{ text: string; type?: string } | null>(null); // одноразовый тост для каталога (напр. после «Повторить заказ»)
  // Экран, на который нужно попасть СРАЗУ после выбора города — используется,
  // когда пользователь уходит по короткому пути из квиза (напр. «к AI-доктору»)
  // ещё до того, как регион выбран, но CityPicker обязателен перед любым экраном.
  // Инициализируем экраном из URL: если человек открыл шер-ссылку на каталог/
  // карточку рыбы с холодным стартом (региона в памяти ещё нет), после выбора
  // города он должен попасть туда, куда его звала ссылка, а не всегда на "home".
  const [pendingScreenAfterCity, setPendingScreenAfterCity] = useState<Screen | null>(() => {
    const s = router.screen;
    return s !== "landing" && s !== "quiz" && s !== "city" ? s : null;
  });

  function addClubPost(payload: ClubPostDraft) {
    setClubPosts((prev: ClubPost[]) => [
      { id: "p_" + Date.now(), author: "Вы", time: "только что", avatar: "🧑‍🚀", likes: 0, comments: 0, views: 0, ...payload },
      ...prev,
    ]);
  }

  // Повтор заказа из профиля: добавляем товары заказа в текущую корзину,
  // но прогоняем рыб через ту же проверку совместимости, что и обычное
  // добавление в каталоге — иначе можно молча получить несовместимых
  // соседей по аквариуму в один клик.
  function handleRepeatOrder(order) {
    const items = Array.isArray(order?.items) ? order.items : [];
    if (items.length === 0) return;

    const added: any[] = [];
    const skipped: any[] = [];
    setCart((c) => {
      const next = [...c];
      for (const raw of items) {
        const item = { ...raw };
        if (item.type === "fish") {
          const compat = checkCompatibility(item, next);
          if (compat.level === "bad") {
            skipped.push(item);
            continue;
          }
        }
        next.push(item);
        added.push(item);
      }
      return next;
    });

    setScreen("catalog");
    setCartOpen(true);

    if (skipped.length > 0) {
      const names = skipped.map((f) => f.name.split(" ")[0]).join(", ");
      setFlashToast({
        text: added.length > 0
          ? `⚠️ Добавлено ${added.length} из ${items.length}. Пропущено: ${names} — несовместимы`
          : `⚠️ Ничего не добавлено — ${names} несовместимы с корзиной`,
        type: "bad",
      });
    } else {
      setFlashToast({ text: `✅ Заказ добавлен в корзину (${added.length})`, type: "ok" });
    }
  }

  // «Завести аквариум» из заказа: берём рыб из состава заказа и передаём
  // черновик в дневник через тот же механизм PENDING_DIARY_TANK_KEY, что
  // используется при создании дневника сразу после оформления заказа.
  function handleCreateTankFromOrder(order) {
    const fishItems = (Array.isArray(order?.items) ? order.items : []).filter((it) => it.type === "fish");
    if (fishItems.length === 0) return;
    writeLocal(PENDING_DIARY_TANK_KEY, buildTankDraftFromCart(fishItems));
    setScreen("diary");
  }

  // ------------------------------------------------------------------
  // Роутинг верхнего уровня.
  //
  // Раньше это была цепочка из полутора десятков `if (screen === "...")`.
  // Теперь: (1) три экрана-исключения (landing/quiz/city), которые не
  // требуют выбранного региона, обрабатываются явными ранними return;
  // (2) единый гард "нет региона -> CityPicker" применяется один раз,
  // а не проверяется в каждой ветке; (3) все остальные экраны собраны
  // в типизированную таблицу `screens`, где TypeScript требует явно
  // расписать ветку для КАЖДОГО значения типа Screen — забытый экран
  // или опечатка в его названии теперь ошибка компиляции, а не белый
  // экран в проде.

  // Общая логика входа в личный кабинет продавца/курьера: экран "нет
  // доступа" -> логин -> обязательная смена временного пароля -> кабинет.
  // Раньше эта логика была продублирована почти дословно для seller и
  // courier; теперь это один параметризуемый рендерер.
  function renderRoleCabinet(role: Extract<Role, "seller" | "courier">, Cabinet: React.ComponentType<{ onBack: () => void }>) {
    if (auth.noAccessRole === role) {
      return <ContactSupportScreen role={role} onBack={() => auth.dismissNoAccess()} />;
    }
    if (!auth.loggedInAcc || auth.loggedInAcc.role !== role) {
      return (
        <LoginScreen
          role={role}
          accounts={auth.accounts}
          onBack={() => setScreen("catalog")}
          onNoAccess={() => auth.requestNoAccess(role)}
          onLogin={(acc, needChange) => auth.login(acc, !!needChange)}
        />
      );
    }
    if (auth.needChangePwd) {
      return (
        <ChangePasswordScreen
          account={auth.loggedInAcc}
          onDone={(newPwd) => auth.changePassword(newPwd)}
        />
      );
    }
    return (
      <Suspense fallback={<ScreenLoadingFallback />}>
        <Cabinet onBack={() => { auth.logout(); setScreen("catalog"); }} />
      </Suspense>
    );
  }

  // Тот же паттерн входа, что и у seller/courier (LoginScreen → обязательная
  // смена временного пароля → кабинет), но для единственного role: "admin"
  // аккаунта и с другим набором пропсов у самой панели (CRUD аккаунтов и
  // т.п.), поэтому не через renderRoleCabinet, а отдельной функцией.
  function renderAdminPanel() {
    if (!auth.loggedInAcc || auth.loggedInAcc.role !== "admin") {
      return (
        <LoginScreen
          role="admin"
          accounts={auth.accounts}
          onBack={() => setScreen("profile")}
          onNoAccess={() => auth.requestNoAccess("admin")}
          onLogin={(acc, needChange) => auth.login(acc, !!needChange)}
        />
      );
    }
    if (auth.needChangePwd) {
      return (
        <ChangePasswordScreen
          account={auth.loggedInAcc}
          onDone={(newPwd) => auth.changePassword(newPwd)}
        />
      );
    }
    return (
      <Suspense fallback={<ScreenLoadingFallback />}>
        <AdminPanel
          onBack={() => { auth.logout(); setScreen("profile"); }}
          accounts={auth.accounts}
          onRefreshAccounts={auth.refreshAccounts}
          onAddAccount={auth.addAccount}
          onUpdateAccount={auth.updateAccount}
          onToggleAccount={auth.toggleAccount}
          onDeleteAccount={auth.deleteAccount}
          onResetPassword={auth.resetPassword}
        />
      </Suspense>
    );
  }

  // Главная страница: лендинг-шапка + каталог. Это и экран "catalog", и
  // запасной вариант для "delivery" без выбранного заказа для отслеживания
  // (сохраняет прежнее поведение: раньше это был неявный fallback в конце
  // цепочки if/else).
  function renderCatalogHome() {
    return (
      <>
        <OfflineBanner />
        {/* Компактный лендинг-хедер */}
        <HomeHero
          region={region}
          onChangeRegion={() => setScreen("city")}
          onOpenProfile={() => setScreen("profile")}
          onOpenDoctor={() => setScreen("doctor")}
          onOpenDiary={() => setScreen("diary")}
          onOpenSeller={() => setScreen("seller")}
          onOpenCourier={() => setScreen("courier")}
          onOpenClub={() => setScreen("club")}
          cart={cart}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* Каталог — без своего хедера, встроен под лендинг */}
        <Catalog
          region={region}
          cart={cart}
          setCart={setCart}
          initialFishId={router.fishId}
          onOpenFishChange={(id) => router.setFishId(id)}
          onChangeRegion={() => setScreen("city")}
          onOpenConfigurator={() => setConfiguratorOpen(true)}
          onOpenProfile={() => setScreen("profile")}
          onOpenDoctor={() => setScreen("doctor")}
          onOpenHome={() => setScreen("home")}
          onOrderPlaced={addOrder}
          externalCartOpen={cartOpen}
          onExternalCartClose={() => setCartOpen(false)}
          hideHeader
          quizFilter={quizFilter}
          onClearQuizFilter={() => setQuizFilter(null)}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          subscriptions={subscriptions}
          onSubscribe={subscribeToProduct}
          initialSearch={catalogSearchSeed}
          onClearInitialSearch={() => setCatalogSearchSeed(null)}
          initialCategory={catalogCategorySeed}
          onClearInitialCategory={() => setCatalogCategorySeed(null)}
          onOpenDiary={() => setScreen("diary")}
          initialToast={flashToast}
          onClearInitialToast={() => setFlashToast(null)}
        />

        <GlobalConfigurator
          open={configuratorOpen}
          onClose={() => setConfiguratorOpen(false)}
          setCart={setCart}
        />
      </>
    );
  }

  // Экраны, которые не требуют выбранного региона — обрабатываем их до
  // единого гарда ниже.
  if (screen === "landing") return <Landing onEnter={() => setScreen("quiz")} />;

  if (screen === "quiz")
    return (
      <>
      <OnboardingQuiz
        onDone={({ cartItems, quizFilter: qf }) => {
          if (cartItems && cartItems.length > 0) setCart(cartItems);
          setQuizFilter(qf || null);
          setScreen("city");
        }}
        onOpenConfigurator={() => setConfiguratorOpen(true)}
        onOpenDoctor={() => {
          // Экран доктора требует выбранный регион (иначе общий гард ниже
          // всё равно покажет CityPicker) — запоминаем цель и уходим её выбирать.
          setPendingScreenAfterCity("doctor");
          setScreen("city");
        }}
      />
      <GlobalConfigurator
        open={configuratorOpen}
        onClose={() => setConfiguratorOpen(false)}
        setCart={setCart}
        // Конфигуратор уже собрал аквариум под ключ — дальше отвечать
        // на вопросы квиза незачем, сразу отправляем выбирать город.
        onApplied={() => setScreen("city")}
      />
      </>
    );

  // Единый гард: любой экран, кроме landing/quiz (уже обработаны выше),
  // требует выбранный регион. Раньше это условие ("city" || !region)
  // проверялось внутри одной конкретной ветки — теперь оно применяется
  // ко всем экранам разом, так что новый экран, добавленный в таблицу
  // ниже, автоматически получает эту защиту бесплатно.
  if (screen === "city" || !region)
    return (
      <CityPicker
        onSelect={(r) => {
          setRegion(r);
          const target = pendingScreenAfterCity || "home";
          router.navigate(target, { fishId: target === "catalog" ? router.fishId : null });
          setPendingScreenAfterCity(null);
        }}
      />
    );

  // Таблица маршрутов для всех экранов, которым уже гарантирован регион.
  // `Exclude<Screen, "landing" | "quiz" | "city">` — TypeScript заставит
  // расписать здесь ветку для каждого оставшегося значения Screen.
  const screens: Record<Exclude<Screen, "landing" | "quiz" | "city">, () => React.ReactNode> = {
    home: () => (
      <>
        <HomeScreen
          region={region}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          subscriptions={subscriptions}
          onSubscribe={subscribeToProduct}
          onOpenCatalog={() => setScreen("catalog")}
          onOpenCart={() => { setScreen("catalog"); setCartOpen(true); }}
          onOpenProfile={() => { setProfileInitialTab(null); setScreen("profile"); }}
          onOpenFavorites={() => { setProfileInitialTab("favorites"); setScreen("profile"); }}
          onOpenDoctor={() => setScreen("doctor")}
          onOpenConfigurator={() => setConfiguratorOpen(true)}
          onOrderPlaced={addOrder}
          quizFilter={quizFilter}
          onClearQuizFilter={() => setQuizFilter(null)}
          onOpenDiary={() => setScreen("diary")}
        />
        <GlobalConfigurator
          open={configuratorOpen}
          onClose={() => setConfiguratorOpen(false)}
          setCart={setCart}
        />
      </>
    ),

    catalog: renderCatalogHome,

    doctor: () => (
      <Suspense fallback={<ScreenLoadingFallback />}>
        <FishDoctorScreen onBack={() => setScreen("catalog")} cart={cart} setCart={setCart} />
      </Suspense>
    ),

    diary: () => (
      <DiaryScreen
        onBack={() => setScreen("catalog")}
        onAddClubPost={addClubPost}
        onStatsUpdate={setDiaryStats}
        onOpenCatalog={(query) => { setCatalogSearchSeed(query); setScreen("catalog"); }}
      />
    ),

    club: () => <ClubScreen onBack={() => setScreen("catalog")} posts={clubPosts} diaryStats={diaryStats} onAddPost={addClubPost} />,

    seller: () => renderRoleCabinet("seller", SellerCabinet),

    courier: () => renderRoleCabinet("courier", CourierView),

    admin: () => renderAdminPanel(),

    // Раньше при "delivery" без trackingOrder условие if() просто не
    // срабатывало и код проваливался в fallback-каталог в конце файла —
    // здесь та же логика, но явная, а не побочный эффект порядка ifов.
    delivery: () => trackingOrder
      ? (
        <DeliveryTracker
          order={trackingOrder}
          onBack={() => setScreen("profile")}
          onSimulate={(status) => {
            const updated = { ...trackingOrder, status };
            setTrackingOrder(updated);
            setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
            if (notifPrefs.delivery) {
              const info = ORDER_STATUSES.find((s) => s.key === status);
              notifyTelegram("order_status", { orderId: updated.id, status, label: info?.label, desc: info?.desc });
            }
          }}
        />
      )
      : renderCatalogHome(),

    profile: () => (
      <Profile
        onBack={() => setScreen("home")}
        onOpenCatalog={() => setScreen("catalog")}
        initialTab={profileInitialTab}
        orders={orders}
        userTanks={userTanks}
        setUserTanks={setUserTanks}
        onTrackOrder={(order) => {
          setTrackingOrder(order);
          setScreen("delivery");
        }}
        onRepeatOrder={handleRepeatOrder}
        onCreateTankFromOrder={handleCreateTankFromOrder}
        onOpenDoctor={() => setScreen("doctor")}
        onOpenDiary={() => setScreen("diary")}
        onOpenSeller={() => setScreen("seller")}
        onOpenCourier={() => setScreen("courier")}
        onOpenClub={() => setScreen("club")}
        onOpenAdmin={() => setScreen("admin")}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(f) => setCart((c) => [...c, f])}
        subscriptions={subscriptions}
        onCancelSubscription={cancelSubscription}
        onTogglePauseSubscription={toggleSubscriptionPause}
        notifPrefs={notifPrefs}
        onUpdateNotifPref={updateNotifPref}
      />
    ),
  };

  return <>{screens[screen as Exclude<Screen, "landing" | "quiz" | "city">]()}</>;
}

/* Единая точка входа: любая необработанная ошибка рендера внутри App
   (в каком угодно из ~50 вложенных экранов/модалок) гасится здесь,
   а не роняет весь Mini App в белый экран. */

export default function AppRoot() {
  return (
    <ErrorBoundary>
      <OfflineAuthBanner />
      <App />
    </ErrorBoundary>
  );
}

