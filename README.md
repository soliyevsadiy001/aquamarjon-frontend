# AquaMarjon — разбивка по фичам

Исходный `App.tsx` (13 240 строк, 288 верхнеуровневых деклараций) разложен на 124 файла
по структуре, которую вы предложили:

```
src/
  screens/{catalog,checkout,delivery,configurator,profile,seller,doctor,diary,club,home,auth,admin}/
  components/ui/       (Icon, Toast, Skeleton, Bubbles, Sticker, Confetti...)
  hooks/                (useCart, useAuth, useWishlist, useSubscriptions...)
  data/                 (fish.ts, products.ts, regions.ts, admin-seed.ts...)
  lib/                  (api.ts, promo.ts, diary-stats.ts, catalog-utils.ts...)
  theme.ts, types.ts    (без изменений)
  App.tsx               (только Screen-тип, App() и AppRoot())
```

## Как это делалось
Не вручную copy-paste — механический codemod: каждая из 288 деклараций (function/const/
interface/type/class/let) была извлечена как блок, распределена по целевому файлу, а импорты
между файлами построены автоматически сканированием использованных идентификаторов
(с игнорированием комментариев и строк, чтобы не ловить ложные совпадения). Всем декларациям
добавлен `export`.

## Проверка корректности
Разбитая версия и исходный монолит прогнаны через `tsc --noEmit` с одинаковым офлайн-стабом
типов React (сеть недоступна, поэтому не настоящие `@types/react`, но тип-чекер реальный).
**Множества ошибок идентичны посимвольно** — то есть разбивка не сломала ни одной связи и не
внесла ни одной новой ошибки. Все ~70 оставшихся warning'ов (implicit any, `key` в пропсах,
несовпадения `string`/`IconName` и т.п.) существовали в исходном файле и не связаны с рефакторингом.

## Что не сделано (следующий шаг)
- Найденные tsc предупреждения (implicit any в пропсах Catalog/FishCard/SellerOrderRow и т.п.)
  можно поправить отдельным проходом, раз структура файлов уже готова.
- `lib/catalog-utils.tsx` — единственный файл в `lib/`, который остался `.tsx`, потому что
  `highlightMatch()` возвращает JSX.

## Сборка (добавлено)
Проект теперь настоящее Vite-приложение: `package.json`, `tsconfig.json`,
`tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`,
`src/vite-env.d.ts`, `.gitignore`, `.env.example`, `.eslintrc.cjs`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # tsc --noEmit && vite build -> dist/
npm run typecheck   # только проверка типов
```

`src/lib/api.ts` теперь читает адрес бэкенда из `VITE_API_URL` (см. `.env.example`,
скопируйте в `.env.local`), с фолбэком на `process.env.REACT_APP_API_URL`/
`NEXT_PUBLIC_API_URL` и дефолтный URL, если ничего не задано.

**Важно:** `npm install` в этой сессии не выполнялся — у меня отключён сетевой
доступ в этой песочнице (это ограничение окружения, не проекта). Вместо этого
я прогнал весь `src/` через офлайн `tsc` с самодельным минимальным стабом типов
React (тот же приём, что описан в разделе «Проверка корректности» выше) —
структура импортов и синтаксис у всех 124 файлов корректны, ошибок резолва
модулей нет. Оставшиеся ~100 предупреждений типов (implicit `any`/`unknown` в
Catalog.tsx, SellerStockFlow.tsx, OnboardingQuiz.tsx и паре других мест) — те
же самые, что были в исходном монолите, задача untouched. Настоящую сборку
(`npm install && npm run build`) нужно один раз прогнать на вашей машине с
доступом в интернет, чтобы получить финальное подтверждение с реальными
`@types/react`.

## Тесты и инструменты (добавлено)

```bash
npm run test          # vitest run — один прогон, для CI
npm run test:watch    # vitest — watch-режим для разработки
npm run format        # prettier --write . (не запускался целиком — см. ниже)
npm run format:check  # prettier --check . (используется в CI как необязательный джоб)
```

Юнит-тестами покрыта чистая логика в `src/lib/`, у которой нет сайд-эффектов
и не нужен рендер компонентов — самое дешёвое и ценное место для тестов:
- `catalog-utils.test.ts` — `checkCompatibility()` (bad/warn/ok, симметрия
  avoid, приоритет bad над warn, разрешение по `speciesId`) и `hashStr()`.
- `promo.test.ts` — `calcPromoSavings()` (percent/fixed/free_delivery,
  округление, скидка не больше суммы заказа) и `promoErrorMessage()`.
- `diary-stats.test.ts` — стрики дней подряд, русское склонение
  (`diaryPluralRu`), уровни дневника, тиры выживаемости рыб, срочность ухода.

Настройка — `vitest.config.ts` (jsdom, coverage только по `src/lib/**`) +
`src/test/setup.ts` (jest-dom матчеры на будущее, для компонентных тестов).
`.github/workflows/ci.yml` гоняет typecheck → lint → test → build на каждый
push/PR в `main`; форматирование — отдельным необязательным джобом.

**Не сделано в этом проходе (осознанно, без сети и без возможности
визуально проверить результат):**
- `npm run format` **не запускался** по всему репозиторию. Prettier-конфиг
  подключён, но одномоментный `--write .` по 138 файлам — это отдельный
  большой diff, который надо смотреть глазами (риск задеть места, где
  форматирование сейчас неконсистентно нарочно, напр. плотные
  style-объекты в `FishDoctorScreen.tsx`), а не мёржить не глядя.
- 77 мест с `any`/`as any` и дальнейшее дробление `Catalog.tsx`/`Profile.tsx`/
  `Landing.tsx` — не тронуты. Теперь, когда есть тесты для `lib/*` и CI,
  который их прогоняет, это как раз безопасное время этим заняться:
  `npm run test` в CI поймает, если правка типа/структуры что-то сломает
  в поведении, а не только в типах.
- Тесты не запускались локально (`npm install` в этой песочнице недоступен —
  нет сети, то же ограничение, что и в разделе «Сборка» выше). Логика в
  тестах проверена вручную по исходному коду `lib/*`, но финальное
  подтверждение зелёного `npm run test` нужно получить на вашей машине.
