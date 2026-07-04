import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// Telegram Mini App отдаётся как статика (Telegram открывает её в WebView
// по HTTPS-URL, который вы укажете в BotFather) — relative base важен,
// если бандл будет лежать не в корне домена/хостинга (GitHub Pages,
// поддиректория и т.п.). Если деплой в корень своего домена — можно
// оставить "/".

/* ------------------------------------------------------------
   Sentry release id.
   Приоритет: явный SENTRY_RELEASE из CI (например, номер деплоя/тег) →
   иначе git sha текущего чекаута → иначе "unknown-<timestamp>" (сборка не
   в git-репозитории и без переменной — тогда просто нечего трекать, но хотя
   бы не роняем билд). Это же значение уходит и в клиентский бандл
   (см. define ниже + src/lib/sentry.ts), и в сам Sentry-плагин ниже —
   иначе смёрженные sourcemaps не свяжутся с событиями, у которых будет
   другой release.
   ------------------------------------------------------------ */
function resolveRelease(): string {
  if (process.env.SENTRY_RELEASE) return process.env.SENTRY_RELEASE;
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return `unknown-${Date.now()}`;
  }
}

const sentryRelease = resolveRelease();

// Заливка sourcemaps в Sentry — включается только когда в окружении сборки
// заданы SENTRY_AUTH_TOKEN/SENTRY_ORG/SENTRY_PROJECT (обычно секреты CI на
// прод-деплое). Локальная разработка (`npm run dev`, `npm run build` без
// этих переменных) просто собирает бандл как раньше, без обращения к API
// Sentry — не требует токена и не создаёт мусорные релизы за каждый
// локальный билд.
const sentryEnabled =
  !!process.env.SENTRY_AUTH_TOKEN && !!process.env.SENTRY_ORG && !!process.env.SENTRY_PROJECT;

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    sentryEnabled &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: { name: sentryRelease },
        sourcemaps: {
          assets: "./dist/**",
          // Заливаем .map в Sentry и сразу вычищаем их из dist — иначе
          // деминифицированные исходники будут просто лежать рядом с .js
          // на проде и доступны любому через DevTools/curl, а не только
          // самому Sentry.
          filesToDeleteAfterUpload: ["./dist/**/*.map"],
        },
      }),
  ],
  define: {
    __SENTRY_RELEASE__: JSON.stringify(sentryRelease),
  },
  server: {
    port: 5173,
    host: true, // доступ по локальной сети — удобно тестировать в Telegram с телефона через ngrok/tunnel
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
