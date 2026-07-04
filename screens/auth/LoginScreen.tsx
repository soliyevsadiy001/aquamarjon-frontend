import React, { useState } from "react";
import { COLORS, THEME } from "../../theme";
import { AppleEmoji } from "../../components/ui/AppleEmoji";
import { ALLOW_OFFLINE_AUTH_FALLBACK, API, setToken } from "../../lib/api";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" } as const;
const __style2 = { textAlign: "center", marginBottom: 36 } as const;
const __style3 = { marginBottom: 8, display: "flex", justifyContent: "center" } as const;
const __style4 = { fontSize: 22, fontWeight: 900 } as const;
const __style5 = { maxWidth: 360, width: "100%", margin: "0 auto" } as const;
const __style6 = { marginBottom: 14 } as const;
const __style7 = { marginBottom: 6 } as const;
const __style8 = { position: "relative" } as const;
const __style9 = { display: "flex", alignItems: "center", gap: 10, margin: "20px 0 4px" } as const;


export function LoginScreen({ role, onBack, onLogin, accounts, onNoAccess }) {
  const [login,    setLogin]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const roleLabel = role === "courier" ? "Курьер" : role === "seller" ? "Продавец" : "Админ";
  const roleIcon  = role === "courier" ? "🏍️" : role === "seller" ? "🏪" : "🔐";
  const C = THEME;

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim().toLowerCase(), password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Неверный логин или пароль");
        setLoading(false);
        return;
      }
      setToken(data.token);
      onLogin(data.user, data.needPasswordChange);
    } catch {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) {
        setError("Сервер недоступен. Попробуйте позже.");
        setLoading(false);
        return;
      }
      // Fallback к локальной проверке при недоступном бэкенде (только для демо —
      // см. предупреждение у ALLOW_OFFLINE_AUTH_FALLBACK выше)
      const acc = (accounts as any[]).find((a: any) =>
        a.role === role &&
        a.login === login.trim().toLowerCase() &&
        (a.password === password || (a.tempPass && a.tempPass === password))
      );
      if (!acc) { setError("Неверный логин или пароль"); setLoading(false); return; }
      if (!acc.active) { setError("Аккаунт заблокирован."); setLoading(false); return; }
      onLogin(acc, !!(acc.tempPass && acc.tempPass === password));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Шапка */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.soft, fontSize: 13, cursor: "pointer", padding: 0 }}>← Назад</button>
      </div>

      <div style={__style1}>
        {/* Логотип */}
        <div style={__style2}>
          <div style={__style3}><AppleEmoji e={roleIcon} size={52} /></div>
          <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>AquaMarjon</div>
          <div style={__style4}>Вход · {roleLabel}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Введите логин и пароль от вашего аккаунта</div>
        </div>

        {/* Форма */}
        <div style={__style5}>
          {/* Логин */}
          <div style={__style6}>
            <div style={{ fontSize: 12, color: C.soft, marginBottom: 5, fontWeight: 600 }}>Логин</div>
            <input
              value={login}
              onChange={e => { setLogin(e.target.value); setError(""); }}
              placeholder={role === "courier" ? "aziz_courier" : role === "seller" ? "ali_aqua" : "admin"}
              autoCapitalize="none"
              style={{ width: "100%", background: COLORS.panel, border: `1px solid ${error ? C.red : C.border}`, borderRadius: 14, padding: "13px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Пароль */}
          <div style={__style7}>
            <div style={{ fontSize: 12, color: C.soft, marginBottom: 5, fontWeight: 600 }}>Пароль</div>
            <div style={__style8}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && login && password && handleLogin()}
                placeholder="••••••"
                style={{ width: "100%", background: COLORS.panel, border: `1px solid ${error ? C.red : C.border}`, borderRadius: 14, padding: "13px 48px 13px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Ошибка */}
          {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 12, marginTop: 4 }}>⚠️ {error}</div>}

          {/* Подсказка забыл пароль */}
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, marginTop: 8 }}>
            Забыли пароль? Обратитесь к администратору — он сбросит пароль.
          </div>

          {/* Кнопка входа */}
          <button
            onClick={handleLogin}
            disabled={!login.trim() || !password || loading}
            style={{
              width: "100%",
              background: login && password ? `linear-gradient(135deg, ${C.teal}, #00A896)` : COLORS.border,
              color: login && password ? COLORS.bg : C.muted,
              border: "none", borderRadius: 14, padding: "15px",
              fontSize: 16, fontWeight: 800, cursor: login && password ? "pointer" : "default",
              boxShadow: login && password ? `0 6px 24px ${C.teal}44` : "none",
            }}
          >
            {loading ? "⏳ Проверяем..." : `Войти как ${roleLabel}`}
          </button>

          {/* «Нет доступа? Свяжитесь с нами» — только для курьера/продавца.
              Для админа это не тот же flow: заявка на доступ через бота
              подходит для «меня ещё не завели», а не для «дайте мне права
              администратора» — этой веткой сознательно не пользуемся. */}
          {role !== "admin" && (
            <>
              <div style={__style9}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>Нет доступа?</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              <button
                onClick={onNoAccess}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.soft,
                  borderRadius: 14, padding: "13px",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  marginTop: 10,
                }}
              >
                📩 Связаться с нами
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Экран смены пароля (после сброса) ────────────────────────
