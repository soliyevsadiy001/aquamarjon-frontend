import React, { useState } from "react";
import { COLORS, THEME } from "../../theme";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { textAlign: "center", marginBottom: 32 } as const;
const __style2 = { fontSize: 42, marginBottom: 8 } as const;
const __style3 = { fontSize: 20, fontWeight: 900 } as const;
const __style4 = { maxWidth: 360, width: "100%", margin: "0 auto" } as const;
const __style5 = { marginBottom: 12 } as const;
const __style6 = { position: "relative" } as const;
const __style7 = { marginBottom: 6 } as const;


export function ChangePasswordScreen({ account, onDone }) {
  const [newPass,    setNewPass]    = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const C = THEME;

  function handleSave() {
    if (newPass.length < 4) { setError("Минимум 4 символа"); return; }
    if (newPass !== confirm) { setError("Пароли не совпадают"); return; }
    onDone(newPass);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" }}>
      <div style={__style1}>
        <div style={__style2}>🔑</div>
        <div style={__style3}>Установите новый пароль</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Ваш пароль был сброшен администратором. Установите новый пароль для входа.</div>
      </div>

      <div style={__style4}>
        <div style={__style5}>
          <div style={{ fontSize: 12, color: C.soft, marginBottom: 5 }}>Новый пароль</div>
          <div style={__style6}>
            <input type={showPass ? "text" : "password"} value={newPass} onChange={e => { setNewPass(e.target.value); setError(""); }}
              placeholder="Минимум 4 символа"
              style={{ width: "100%", background: COLORS.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 44px 12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 15 }}>{showPass ? "🙈" : "👁"}</button>
          </div>
        </div>
        <div style={__style7}>
          <div style={{ fontSize: 12, color: C.soft, marginBottom: 5 }}>Повторите пароль</div>
          <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }}
            placeholder="••••••"
            style={{ width: "100%", background: COLORS.panel, border: `1px solid ${error ? C.red : C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {error && <div style={{ fontSize: 12, color: C.red, marginBottom: 10 }}>⚠️ {error}</div>}
        <button onClick={handleSave} disabled={!newPass || !confirm}
          style={{ width: "100%", marginTop: 16, background: newPass && confirm ? C.teal : COLORS.border, color: newPass && confirm ? COLORS.bg : C.muted, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: newPass && confirm ? "pointer" : "default" }}>
          ✅ Сохранить новый пароль
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   🔧 ADMIN PANEL — полноценная панель управления AquaMarjon
   Все данные живые: редактирование, удаление, смена статусов,
   промокоды, тарифы, настройки, курьеры, товары, клиенты
   ============================================================ */

// ── Начальные данные ──────────────────────────────────────────
