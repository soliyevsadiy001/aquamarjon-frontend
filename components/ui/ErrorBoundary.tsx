import React from "react";
import { COLORS } from "../../theme";
import { captureClientError } from "../../lib/sentry";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
          minHeight: "100vh",
          background: "radial-gradient(ellipse at top, #0E2235 0%, #08131F 70%)",
          color: COLORS.text,
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px 20px", textAlign: "center",
        } as const;
const __style2 = { fontSize: 48, marginBottom: 16 } as const;
const __style3 = { fontSize: 19, fontWeight: 900, margin: "0 0 8px", fontFamily: "Georgia, serif" } as const;
const __style4 = { fontSize: 13, color: COLORS.soft, lineHeight: 1.6, maxWidth: 320, margin: "0 0 24px" } as const;
const __style5 = { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280, marginBottom: 20 } as const;
const __style6 = {
                background: "linear-gradient(135deg, #00C9B1, #00A896)", color: COLORS.bg,
                border: "none", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 800,
                cursor: "pointer", boxShadow: "0 6px 24px #00C9B144",
              } as const;
const __style7 = {
                background: COLORS.panel, color: COLORS.soft,
                border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "13px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              } as const;
const __style8 = { fontSize: 11, color: COLORS.muted, maxWidth: 320, textAlign: "left" } as const;
const __style9 = { cursor: "pointer", marginBottom: 6 } as const;
const __style10 = {
              background: COLORS.bg2, border: `1px solid ${COLORS.border}`, borderRadius: 10,
              padding: "10px 12px", fontFamily: "monospace", whiteSpace: "pre-wrap",
              wordBreak: "break-word", maxHeight: 160, overflowY: "auto",
            } as const;


export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Единая точка логирования непойманных ошибок рендера — теперь пишет и в
    // Sentry (componentStack кладём в extra, чтобы видеть, какой компонент упал).
    console.error("AquaMarjon: unhandled render error", error, errorInfo);
    captureClientError(error, "ErrorBoundary: unhandled render error", {
      componentStack: errorInfo.componentStack,
    });
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    // Чистим только собственные ключи приложения (префикс aqua_), а не весь
    // localStorage целиком — Telegram WebView или соседний виджет могут
    // хранить там что-то своё, что лучше не трогать.
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("aqua_"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div style={__style1}>
          <div style={__style2}>🐠💥</div>
          <h1 style={__style3}>
            Что-то пошло не так
          </h1>
          <p style={__style4}>
            Приложение столкнулось с неожиданной ошибкой. Ваши заказы и данные не пропали —
            попробуйте обновить страницу.
          </p>

          <div style={__style5}>
            <button
              onClick={this.handleReload}
              style={__style6}
            >
              Обновить страницу
            </button>
            <button
              onClick={this.handleResetAndReload}
              style={__style7}
            >
              Сбросить локальные данные и обновить
            </button>
          </div>

          {/* Технические детали — свёрнуты по умолчанию, пригодятся при обращении
              в поддержку (можно сделать скриншот) или для отладки в devtools. */}
          <details style={__style8}>
            <summary style={__style9}>Технические детали</summary>
            <div style={__style10}>
              {this.state.error?.message || String(this.state.error)}
              {this.state.errorInfo?.componentStack ? `\n${this.state.errorInfo.componentStack}` : ""}
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ============================================================
   AquaMarjon — бэкенд интеграция
   ============================================================ */
// API URL берётся из переменной окружения, если она задана сборщиком, иначе —
// дефолт (текущий прод-бэкенд), чтобы ничего не сломалось, если .env не настроен.
// Работает «из коробки» с CRA/Next.js (REACT_APP_API_URL / NEXT_PUBLIC_API_URL).
// ⚠️ Если сборщик — Vite: process.env там по умолчанию не определён, замените
// строку ниже на:
//   const API = import.meta.env.VITE_API_URL || "https://aqua-uz-backend.up.railway.app/api";
// и добавьте VITE_API_URL=... в .env (переменные Vite обязаны начинаться с VITE_).
