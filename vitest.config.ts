import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Отдельный конфиг для vitest (а не тестовый блок внутри vite.config.ts) —
// так `vite.config.ts` остаётся конфигом только приложения, а `npm run build`
// не тянет за собой vitest-специфичные типы/опции. Vite сам подхватит этот
// файл при запуске `vitest`/`vitest run`.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // На старте покрытием отчитываемся только по lib/ — это чистая логика
      // без UI (см. README/обсуждение), самая дешёвая и ценная цель для
      // юнит-тестов. Экраны/компоненты сознательно не включены в coverage
      // порог, чтобы не создавать иллюзию "протестированного UI" там, где
      // тестов пока физически нет.
      include: ["src/lib/**"],
    },
  },
});
