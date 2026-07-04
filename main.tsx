import React from "react";
import ReactDOM from "react-dom/client";
import AppRoot from "./App";
import { initSentry } from "./lib/sentry";

// Инициализация до маунта React — ловим и ошибки самого early-init,
// если такие появятся. Если VITE_SENTRY_DSN не задан, initSentry() — no-op.
initSentry();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("#root не найден в index.html");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
