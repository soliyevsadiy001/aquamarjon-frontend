/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Инжектится через `define` в vite.config.ts на этапе сборки — git sha
// (или SENTRY_RELEASE из CI), чтобы Sentry.init() ниже мог проставить
// release и связать события с конкретным деплоем/закоммиченными
// sourcemaps. См. resolveRelease() в vite.config.ts.
declare const __SENTRY_RELEASE__: string;
