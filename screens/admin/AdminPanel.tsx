import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../../theme";
import { ADMIN_INIT_COURIERS, ADMIN_INIT_ORDERS, ADMIN_INIT_PRODUCTS, ADMIN_INIT_PROMOS, ADMIN_INIT_SETTINGS, ADMIN_SC } from "../../data/admin-seed";
import { getCatalogOverrides, getSpeciesVariants, saveCatalogOverrides } from "../../data/fish";
import { A } from "../../lib/admin-styles";
import { assignOrderCourier, listOrders, logClientError, updateOrderNote as apiUpdateOrderNote, updateOrderStatus } from "../../lib/api";
import { mapBackendOrder } from "../../lib/orders-map";
import { __style8 } from "./admin-panel-shared-styles";
import { AdminDashboardTab } from "./tabs/AdminDashboardTab";
import { AdminOrdersTab } from "./tabs/AdminOrdersTab";
import { AdminProductsTab } from "./tabs/AdminProductsTab";
import { AdminCatalogTab } from "./tabs/AdminCatalogTab";
import { AdminCouriersTab } from "./tabs/AdminCouriersTab";
import { AdminAccountsTab } from "./tabs/AdminAccountsTab";
import { AdminPromosTab } from "./tabs/AdminPromosTab";
import { AdminSettingsTab } from "./tabs/AdminSettingsTab";
/* Стили самой шапки/панели табов админки — используются только здесь. */
const __style1 = { minHeight: "100vh", background: A.bg, color: A.text, paddingBottom: 50, fontFamily: "system-ui, -apple-system, sans-serif" } as const;
const __style2 = { background: A.card, borderBottom: `1px solid ${A.border}`, padding: "14px 16px 0" } as const;
const __style3 = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } as const;
const __style4 = { background: "none", border: "none", color: A.soft, fontSize: 12, cursor: "pointer", padding: 0, marginBottom: 4, display: "block" } as const;
const __style5 = { fontSize: 9, color: A.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" } as const;
const __style6 = { fontSize: 19, fontWeight: 900 } as const;
const __style7 = { textAlign: "right" } as const;
const __style9 = { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 0, marginBottom: 0 } as const;
const __style10 = { position: "absolute", top: 4, right: 2, background: A.red, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "0 4px", minWidth: 14, textAlign: "center" } as const;
export function AdminPanel({
  onBack,
  accounts,
  onRefreshAccounts,
  onAddAccount,
  onUpdateAccount,
  onToggleAccount,
  onDeleteAccount,
  onResetPassword,
}) {
  const [tab, setTab] = useState("dashboard");

  // живые данные
  const [orders,   setOrders]   = useState(ADMIN_INIT_ORDERS);
  const [products, setProducts] = useState(ADMIN_INIT_PRODUCTS);
  const [couriers, setCouriers] = useState(ADMIN_INIT_COURIERS);
  const [promos,   setPromos]   = useState(ADMIN_INIT_PROMOS);
  const [settings, setSettings] = useState(ADMIN_INIT_SETTINGS);
  // accounts теперь приходят пропсами из App.tsx / useAuth() — это тот же
  // массив, по которому логинится LoginScreen, а не отдельный локальный стейт.

  // UI state
  const [orderFilter,   setOrderFilter]   = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [openOrderId,   setOpenOrderId]   = useState(null);
  const [editProduct,   setEditProduct]   = useState(null); // {id} редактируемый
  const [newPromoModal, setNewPromoModal] = useState(false);
  const [newPromoCode,  setNewPromoCode]  = useState("");
  const [newPromoDisc,  setNewPromoDisc]  = useState("10");
  const [newPromoMax,   setNewPromoMax]   = useState("100");
  const [newPromoExp,   setNewPromoExp]   = useState("31.12.2025");
  const [confirmClose,  setConfirmClose]  = useState(false);
  const [toast,         setToast]         = useState(null);
  const toastRef = useRef(null);

  // Accounts UI state
  const [accFilter,   setAccFilter]   = useState("all"); // all | courier | seller
  const [accEditId,   setAccEditId]   = useState(null);  // редактируемый аккаунт
  const [newAccModal, setNewAccModal] = useState(false);
  const [newAcc, setNewAcc] = useState({ role: "courier", name: "", phone: "", region: "Ташкент", login: "", password: "" });
  const [resetConfirm, setResetConfirm] = useState(null); // id аккаунта для подтверждения сброса

  // Подтягиваем актуальный список аккаунтов с бэкенда при открытии панели —
  // если бэкенд недоступен/ручка ещё не поднята, onRefreshAccounts молча
  // ничего не делает и мы остаёмся на том, что уже есть (localStorage/INIT_ACCOUNTS).
  useEffect(() => {
    onRefreshAccounts?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Подтягиваем реальные заказы с бэкенда (GET /orders) — раньше эта
  // вкладка жила исключительно на ADMIN_INIT_ORDERS и не видела заказы,
  // реально оформленные покупателями. Если бэкенд недоступен (офлайн-
  // демо, локальная разработка без запущенного сервера), молча остаёмся
  // на демо-данных — как и остальные вкладки админки в переходный период.
  useEffect(() => {
    let cancelled = false;
    listOrders()
      .then((rows) => {
        if (cancelled) return;
        setOrders(rows.map(mapBackendOrder));
      })
      .catch((err) => {
        logClientError("AdminPanel.listOrders", err);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Каталог рыб: какие карточки-варианты (окрас/порода) и размеры/цены/фото
  // есть у вида — это единственное место, где это редактируется.
  const [catalogSpeciesId, setCatalogSpeciesId] = useState(null);
  const [catalogDraft, setCatalogDraft] = useState(null);
  const [catalogVersion, setCatalogVersion] = useState(0);

  function showToast(text, type = "ok") {
    setToast({ text, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2200);
  }

  // ── Orders ───────────────────────────────────────────────────
  const noteDebounceRef = useRef({});
  function moveOrderStatus(id, toStatus) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: toStatus } : o));
    showToast(`Заказ #${id} → «${ADMIN_SC[toStatus]?.label}»`);
    updateOrderStatus(String(id), toStatus).catch((err) => logClientError("AdminPanel.updateOrderStatus", err, { id, toStatus }));
  }
  function cancelOrder(id) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    showToast(`Заказ #${id} отменён`, "bad");
    updateOrderStatus(String(id), "cancelled").catch((err) => logClientError("AdminPanel.cancelOrder", err, { id }));
  }
  function updateOrderNote(id, note) {
    setOrders(os => os.map(o => o.id === id ? { ...o, note } : o));
    // Дебаунсим сетевой запрос — иначе каждая нажатая клавиша в textarea
    // улетала бы отдельным PATCH-ом.
    clearTimeout(noteDebounceRef.current[id]);
    noteDebounceRef.current[id] = setTimeout(() => {
      apiUpdateOrderNote(String(id), note).catch((err) => logClientError("AdminPanel.updateOrderNote", err, { id }));
    }, 600);
  }
  function assignCourier(id, courier) {
    setOrders(os => os.map(o => o.id === id ? { ...o, courier } : o));
    assignOrderCourier(String(id), courier).catch((err) => logClientError("AdminPanel.assignCourier", err, { id, courier }));
  }

  const filteredOrders = orders.filter(o => orderFilter === "all" || o.status === orderFilter);

  // ── Products ─────────────────────────────────────────────────
  function toggleProduct(id) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const p = products.find(x => x.id === id);
    showToast(`«${p?.name}» ${p?.active ? "скрыт" : "активирован"}`);
  }
  function updateProduct(id, field, val) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: val } : p));
  }
  function deleteProduct(id) {
    const p = products.find(x => x.id === id);
    if (!window.confirm(`Удалить «${p?.name}»? Это действие нельзя отменить.`)) return;
    setProducts(ps => ps.filter(x => x.id !== id));
    setEditProduct(null);
    showToast(`«${p?.name}» удалён`, "bad");
  }
  function saveProduct() {
    showToast("Изменения сохранены ✅");
    setEditProduct(null);
  }

  // ── Каталог рыб (карточки-варианты и размеры) ───────────────
  function openCatalogSpecies(speciesId) {
    setCatalogSpeciesId(speciesId);
    const existing = getSpeciesVariants(speciesId);
    setCatalogDraft(existing ? JSON.parse(JSON.stringify(existing)) : []);
  }
  function addCatalogVariant() {
    setCatalogDraft(d => [...d, { id: "v" + Date.now(), name: "Новая карточка", photo: null, sizes: [{ id: "s" + Date.now(), cm: "", price: 0 }] }]);
  }
  function updateCatalogVariant(vid, field, val) {
    setCatalogDraft(d => d.map(v => v.id === vid ? { ...v, [field]: val } : v));
  }
  function deleteCatalogVariant(vid) {
    if (!window.confirm("Удалить эту карточку вида? Она пропадёт из каталога.")) return;
    setCatalogDraft(d => d.filter(v => v.id !== vid));
  }
  function addCatalogSize(vid) {
    setCatalogDraft(d => d.map(v => v.id === vid ? { ...v, sizes: [...v.sizes, { id: "s" + Date.now(), cm: "", price: 0 }] } : v));
  }
  function updateCatalogSize(vid, sid, field, val) {
    setCatalogDraft(d => d.map(v => v.id === vid ? { ...v, sizes: v.sizes.map(s => s.id === sid ? { ...s, [field]: field === "price" ? (Number(val) || 0) : val } : s) } : v));
  }
  function deleteCatalogSize(vid, sid) {
    setCatalogDraft(d => d.map(v => v.id === vid ? { ...v, sizes: v.sizes.filter(s => s.id !== sid) } : v));
  }
  function handleCatalogPhoto(vid, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateCatalogVariant(vid, "photo", ev.target.result);
    reader.readAsDataURL(file);
  }
  function saveCatalogDraft() {
    const overrides = getCatalogOverrides();
    overrides[catalogSpeciesId] = { variants: catalogDraft };
    saveCatalogOverrides(overrides);
    setCatalogVersion(v => v + 1);
    showToast("Карточки сохранены ✅ Обновляю каталог…");
    setTimeout(() => window.location.reload(), 900);
  }

  const filteredProducts = products.filter(p =>
    productFilter === "all" || p.cat === productFilter ||
    (productFilter === "low" && p.stock <= 3) ||
    (productFilter === "hidden" && !p.active)
  );

  // ── Couriers ─────────────────────────────────────────────────
  function toggleCourierOnline(id) {
    setCouriers(cs => cs.map(c => c.id === id ? { ...c, online: !c.online } : c));
  }
  function toggleCourierBlock(id) {
    const c = couriers.find(x => x.id === id);
    if (!c?.blocked && !window.confirm(`Заблокировать курьера «${c?.name}»? Он потеряет доступ к заказам.`)) return;
    setCouriers(cs => cs.map(x => x.id === id ? { ...x, blocked: !x.blocked, online: false } : x));
    showToast(`${c?.name} ${c?.blocked ? "разблокирован" : "заблокирован"}`, c?.blocked ? "ok" : "bad");
  }
  function updateCourierRate(id, rate) {
    setCouriers(cs => cs.map(c => c.id === id ? { ...c, rate: Number(rate) || c.rate } : c));
  }

  // ── Promos ───────────────────────────────────────────────────
  function togglePromo(code) {
    setPromos(ps => ps.map(p => p.code === code ? { ...p, active: !p.active } : p));
  }
  function deletePromo(code) {
    if (!window.confirm(`Удалить промокод ${code}? Он перестанет работать у всех, кто его ещё не использовал.`)) return;
    setPromos(ps => ps.filter(p => p.code !== code));
    showToast(`Промокод ${code} удалён`, "bad");
  }
  function addPromo() {
    if (!newPromoCode.trim()) return;
    setPromos(ps => [...ps, { code: newPromoCode.toUpperCase(), discount: Number(newPromoDisc) || 10, uses: 0, maxUses: Number(newPromoMax) || 100, active: true, expires: newPromoExp }]);
    setNewPromoModal(false);
    setNewPromoCode(""); setNewPromoDisc("10"); setNewPromoMax("100"); setNewPromoExp("31.12.2025");
    showToast(`Промокод ${newPromoCode.toUpperCase()} создан ✅`);
  }

  // ── Accounts ─────────────────────────────────────────────────
  // Все мутации теперь идут через onXxx-пропсы из useAuth()/authReducer,
  // которые сперва пробуют бэкенд (/admin/accounts) и только при недоступном
  // бэкенде — при ALLOW_OFFLINE_AUTH_FALLBACK === true — тихо откатываются на
  // локальный state + localStorage (см. lib/api.ts, hooks/useAuth.ts).
  // Если фолбэк выключен и бэкенд недоступен, onXxx-промис отклоняется —
  // ловим это здесь и показываем тост, а не роняем UI молча.

  // login уже нормализуется на вводе (toLowerCase + пробелы → "_"), так что
  // здесь достаточно точного сравнения — но подстраховываемся trim/lowerCase
  // на случай данных, заведённых не через эту форму (сид, бэкенд и т.п.).
  function isLoginTaken(login, excludeId = null) {
    const norm = login.trim().toLowerCase();
    return accounts.some(a => a.id !== excludeId && a.login.trim().toLowerCase() === norm);
  }

  async function resetPassword(id) {
    const a = accounts.find(x => x.id === id);
    try {
      const tmp = await onResetPassword(id);
      setResetConfirm(null);
      showToast(`Пароль сброшен → ${tmp}`);
      return tmp;
    } catch {
      showToast("Не удалось сбросить пароль — сервер недоступен", "bad");
    }
  }
  async function toggleAccount(id) {
    const a = accounts.find(x => x.id === id);
    if (a?.active && !window.confirm(`Заблокировать аккаунт «${a?.name}»? Он потеряет доступ к кабинету.`)) return;
    try {
      await onToggleAccount(id);
      showToast(`${a?.name} ${a?.active ? "заблокирован" : "активирован"}`, a?.active ? "bad" : "ok");
    } catch {
      showToast("Не удалось изменить статус — сервер недоступен", "bad");
    }
  }
  async function updateAccount(id, field, val) {
    if (field === "login") {
      if (!val) return;
      if (isLoginTaken(val, id)) {
        showToast(`Логин «${val}» уже занят другим аккаунтом`, "bad");
        return;
      }
    }
    try {
      await onUpdateAccount(id, field, val);
    } catch {
      showToast("Не удалось сохранить изменения — сервер недоступен", "bad");
    }
  }
  async function deleteAccount(id) {
    const a = accounts.find(x => x.id === id);
    if (!window.confirm(`Удалить аккаунт «${a?.name}»? Это действие нельзя отменить.`)) return;
    try {
      await onDeleteAccount(id);
      setAccEditId(null);
      showToast(`Аккаунт ${a?.name} удалён`, "bad");
    } catch {
      showToast("Не удалось удалить аккаунт — сервер недоступен", "bad");
    }
  }
  async function addAccount() {
    if (!newAcc.name || !newAcc.login || !newAcc.password) return;
    if (isLoginTaken(newAcc.login)) {
      showToast(`Логин «${newAcc.login}» уже занят другим аккаунтом`, "bad");
      return;
    }
    try {
      await onAddAccount(newAcc);
      setNewAccModal(false);
      showToast(`Аккаунт «${newAcc.name}» создан ✅`);
      setNewAcc({ role: "courier", name: "", phone: "", region: "Ташкент", login: "", password: "" });
    } catch {
      showToast("Не удалось создать аккаунт — сервер недоступен", "bad");
    }
  }
  // ⚠️ revealPass/accReveal удалены вместе с постоянным просмотром пароля —
  // см. AdminAccountsTab.tsx и комментарий в types.ts бэкенда про модель
  // "показать один раз". Единственный способ узнать/сменить пароль теперь —
  // resetPassword() ниже (временный пароль, показывается один раз).

  // ── Settings ─────────────────────────────────────────────────
  function setSetting(key, val) {
    setSettings(s => ({ ...s, [key]: val }));
  }

  // ── Metrics ──────────────────────────────────────────────────
  const todayOrders   = orders.filter(o => o.date === "28.06");
  const todayRevenue  = todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter(p => p.active).length;
  const lowStockCount  = products.filter(p => p.stock <= 3 && p.active).length;
  const onlineCouriers = couriers.filter(c => c.online && !c.blocked).length;
  const pendingOrders  = orders.filter(o => o.status === "new" || o.status === "accepted" || o.status === "packed").length;

  const TABS = [
    { id: "dashboard", label: "📊 Обзор" },
    { id: "orders",    label: "📦 Заказы", badge: pendingOrders },
    { id: "products",  label: "🐠 Товары", badge: lowStockCount },
    { id: "catalog",   label: "🖼 Карточки рыб" },
    { id: "couriers",  label: "🏍️ Курьеры" },
    { id: "accounts",  label: "🔐 Аккаунты" },
    { id: "promos",    label: "🎁 Промокоды" },
    { id: "settings",  label: "⚙️ Настройки" },
  ];

  return (
    <div style={__style1}>

      {/* ── Шапка ───────────────────────────────────────────── */}
      <div style={__style2}>
        <div style={__style3}>
          <div>
            <button onClick={onBack} style={__style4}>← Профиль</button>
            <div style={__style5}>AquaMarjon</div>
            <div style={__style6}>🔧 Admin-панель</div>
          </div>
          <div style={__style7}>
            <div style={__style8}>28 июня 2025</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: settings.storeOpen ? A.teal : A.red, marginTop: 2 }}>
              {settings.storeOpen ? "● Магазин открыт" : "○ Магазин закрыт"}
            </div>
          </div>
        </div>

        {/* Табы */}
        <div style={__style9}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              whiteSpace: "nowrap", position: "relative",
              background: tab === t.id ? A.teal : "transparent",
              color: tab === t.id ? COLORS.bg : A.soft,
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${A.teal}` : "2px solid transparent",
              borderRadius: 0, padding: "8px 12px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              {t.label}
              {t.badge > 0 && (
                <span style={__style10}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD ───────────────────────────────────────── */}
      {tab === "dashboard" && (
        <AdminDashboardTab
          orders={orders}
          products={products}
          promos={promos}
          settings={settings}
          activeProducts={activeProducts}
          lowStockCount={lowStockCount}
          onlineCouriers={onlineCouriers}
          pendingOrders={pendingOrders}
          todayOrders={todayOrders}
          todayRevenue={todayRevenue}
          setOrderFilter={setOrderFilter}
          setProductFilter={setProductFilter}
          setTab={setTab}
        />
      )}
      {tab === "orders" && (
        <AdminOrdersTab
          couriers={couriers}
          filteredOrders={filteredOrders}
          orderFilter={orderFilter}
          setOrderFilter={setOrderFilter}
          openOrderId={openOrderId}
          setOpenOrderId={setOpenOrderId}
          moveOrderStatus={moveOrderStatus}
          cancelOrder={cancelOrder}
          updateOrderNote={updateOrderNote}
          assignCourier={assignCourier}
        />
      )}
      {tab === "products" && (
        <AdminProductsTab
          filteredProducts={filteredProducts}
          productFilter={productFilter}
          setProductFilter={setProductFilter}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          toggleProduct={toggleProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          saveProduct={saveProduct}
        />
      )}
      {tab === "catalog" && (
        <AdminCatalogTab
          catalogSpeciesId={catalogSpeciesId}
          setCatalogSpeciesId={setCatalogSpeciesId}
          catalogDraft={catalogDraft}
          setCatalogDraft={setCatalogDraft}
          openCatalogSpecies={openCatalogSpecies}
          addCatalogVariant={addCatalogVariant}
          updateCatalogVariant={updateCatalogVariant}
          deleteCatalogVariant={deleteCatalogVariant}
          addCatalogSize={addCatalogSize}
          updateCatalogSize={updateCatalogSize}
          deleteCatalogSize={deleteCatalogSize}
          handleCatalogPhoto={handleCatalogPhoto}
          saveCatalogDraft={saveCatalogDraft}
        />
      )}
      {tab === "couriers" && (
        <AdminCouriersTab
          couriers={couriers}
          toggleCourierOnline={toggleCourierOnline}
          toggleCourierBlock={toggleCourierBlock}
          updateCourierRate={updateCourierRate}
        />
      )}
      {tab === "accounts" && (
        <AdminAccountsTab
          accounts={accounts}
          accFilter={accFilter}
          setAccFilter={setAccFilter}
          accEditId={accEditId}
          setAccEditId={setAccEditId}
          newAccModal={newAccModal}
          setNewAccModal={setNewAccModal}
          newAcc={newAcc}
          setNewAcc={setNewAcc}
          resetConfirm={resetConfirm}
          setResetConfirm={setResetConfirm}
          isLoginTaken={isLoginTaken}
          resetPassword={resetPassword}
          toggleAccount={toggleAccount}
          updateAccount={updateAccount}
          deleteAccount={deleteAccount}
          addAccount={addAccount}
          showToast={showToast}
        />
      )}
      {tab === "promos" && (
        <AdminPromosTab
          promos={promos}
          newPromoModal={newPromoModal}
          setNewPromoModal={setNewPromoModal}
          newPromoCode={newPromoCode}
          setNewPromoCode={setNewPromoCode}
          newPromoDisc={newPromoDisc}
          setNewPromoDisc={setNewPromoDisc}
          newPromoMax={newPromoMax}
          setNewPromoMax={setNewPromoMax}
          newPromoExp={newPromoExp}
          setNewPromoExp={setNewPromoExp}
          addPromo={addPromo}
          togglePromo={togglePromo}
          deletePromo={deletePromo}
        />
      )}
      {tab === "settings" && (
        <AdminSettingsTab
          settings={settings}
          confirmClose={confirmClose}
          setConfirmClose={setConfirmClose}
          setSetting={setSetting}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.type === "bad" ? COLORS.redBg : COLORS.greenBg, border: `1px solid ${toast.type === "bad" ? A.red : A.teal}`, color: A.text, padding: "10px 18px", borderRadius: 12, fontSize: 13, zIndex: 500, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
