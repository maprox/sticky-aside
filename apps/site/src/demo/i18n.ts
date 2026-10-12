import type { StickyAsideState } from '@sticky-aside/core'

import type { DemoFramework, DemoLocale } from '#site/demo/settings.ts'

type MessageMap = Record<string, string>

export const messages: Record<DemoLocale, MessageMap> = {
  en: {
    'nav.home': 'sticky-aside',
    'nav.github': 'GitHub',
    'nav.lang': 'RU',
    'nav.langLabel': 'Читать по-русски',
    'nav.themeDark': 'Switch to dark theme',
    'nav.themeLight': 'Switch to light theme',
    'variant.5.title': 'Code-first',
    'variant.5.lead': 'Scrub the numbers in the snippet, or use the knobs.',
    'seo.vanilla.title': 'JavaScript sticky sidebar library — sticky-aside',
    'seo.vanilla.description': 'Modern sticky sidebar for current browsers: pins to the edge you scroll toward. Small ESM core, no legacy path. Vanilla JS, plus Vue, React, and Svelte.',
    'seo.vue.title': 'Vue sticky sidebar for Vue 3 — sticky-aside',
    'seo.vue.description': 'Vue 3 sticky sidebar component: both-edge pin for tall panels, lock mode, CSS offsets. Modern browsers only — small ESM, no jQuery or IE-era baggage.',
    'seo.react.title': 'React sticky sidebar — sticky-aside',
    'seo.react.description': 'React sticky sidebar with lock and both-edge pinning when the panel is taller than the viewport. Lightweight ESM for modern browsers — no legacy polyfills.',
    'seo.svelte.title': 'Svelte sticky sidebar — sticky-aside',
    'seo.svelte.description': 'Svelte 5 sticky sidebar adapter over a tiny modern core. Both-edge pin, lock, CSS offsets. Current browsers only — no legacy support tax.',
    'knob.tall': 'Tall panel',
    'knob.top': 'Top offset',
    'knob.bottom': 'Bottom offset',
    'knob.locked': 'Lock',
    'knob.overflowTop': 'Lock may overflow top',
    'knob.overflowBottom': 'Lock may overflow bottom',
    'knob.disabled': 'Disabled',
    'knob.viewport': 'Window height',
    'knob.framework': 'Code',
    'state.flow': 'Riding with the page',
    'state.flowDown': 'Scrolling down, still free',
    'state.flowUp': 'Scrolling up, still free',
    'state.top': 'Pinned to the top of the window',
    'state.bottom': 'Pinned to the bottom of the window',
    'state.locked': 'Held where you locked it',
    'state.off': 'Sticky is off',
    'panel.short': 'Shorter than the window. It stays at the top.',
    'panel.tall': 'Taller than the window. Scroll both ways.',
    'article.p1': 'A short panel stays at the top of the window. A tall one rides with the page until the edge you scroll toward meets the screen.',
    'article.p2': 'Scrolling down pins the bottom of the panel to the bottom of the window. Scrolling up releases it and pins the top. Between those moments the panel just sits in its column.',
    'article.p3': 'Offsets come from CSS. Here the numbers write --sticky-aside-top and --sticky-aside-bottom. With Tailwind you pass top-16 md:top-24 instead.',
    'article.p4': 'Lock holds the panel at the window height where you turned it on. If the column leaves and the lock no longer fits, the panel returns inside the column.',
    'article.p5': 'The core does not know Vue, React, or Svelte. An adapter hands it two elements and listens to props.',
    'article.p6': 'Measurement is an invisible rail glued to the window between the top and bottom offsets, never taller than the panel. That is how the core knows whether the panel fits.',
    'article.p7': 'The listener hangs on window. Nested container scroll is out of scope for this version.',
    'article.p8': 'A fixed panel takes its width from the column. Otherwise it jumps the grid and stretches across the screen.',
  },
  ru: {
    'nav.home': 'sticky-aside',
    'nav.github': 'GitHub',
    'nav.lang': 'EN',
    'nav.langLabel': 'Read in English',
    'nav.themeDark': 'Включить тёмную тему',
    'nav.themeLight': 'Включить светлую тему',
    'variant.5.title': 'Код',
    'variant.5.lead': 'Крутите числа в сниппете или ручки в интерфейсе.',
    'seo.vanilla.title': 'JavaScript sticky sidebar — библиотека sticky-aside',
    'seo.vanilla.description': 'Современный sticky sidebar для актуальных браузеров: пины к краю, к которому скроллите. Компактный ESM-core без legacy. Vanilla JS, плюс Vue, React и Svelte.',
    'seo.vue.title': 'Vue sticky sidebar для Vue 3 — sticky-aside',
    'seo.vue.description': 'Компонент Vue 3 sticky sidebar: пин к обоим краям для высокой панели, lock и CSS-отступы. Только современные браузеры — компактный ESM, без jQuery и legacy.',
    'seo.react.title': 'React sticky sidebar — sticky-aside',
    'seo.react.description': 'React sticky sidebar с lock и пином к обоим краям, когда панель выше окна. Лёгкий ESM для современных браузеров — без legacy-полифилов.',
    'seo.svelte.title': 'Svelte sticky sidebar — sticky-aside',
    'seo.svelte.description': 'Адаптер Svelte 5 sticky sidebar над компактным современным ядром. Пин к обоим краям, lock, CSS-отступы. Только актуальные браузеры — без цены за legacy.',
    'knob.tall': 'Длинная панель',
    'knob.top': 'Отступ сверху',
    'knob.bottom': 'Отступ снизу',
    'knob.locked': 'Замок',
    'knob.overflowTop': 'Замок может вылезти вверх',
    'knob.overflowBottom': 'Замок может вылезти вниз',
    'knob.disabled': 'Выключено',
    'knob.viewport': 'Высота окна',
    'knob.framework': 'Код',
    'state.flow': 'Едет вместе со страницей',
    'state.flowDown': 'Скролл вниз, ещё свободна',
    'state.flowUp': 'Скролл вверх, ещё свободна',
    'state.top': 'Прижата к верху окна',
    'state.bottom': 'Прижата к низу окна',
    'state.locked': 'Держится там, где включили замок',
    'state.off': 'Прилипание выключено',
    'panel.short': 'Панель короче окна и остаётся сверху.',
    'panel.tall': 'Панель выше окна. Крутите страницу в обе стороны.',
    'article.p1': 'Короткая панель остаётся у верхнего края окна. Длинная едет вместе со страницей, пока край, к которому вы скроллите, не упрётся в экран.',
    'article.p2': 'Скролл вниз прижимает низ панели к низу окна. Скролл вверх отпускает её и прижимает верх. Между этими моментами панель просто стоит в колонке.',
    'article.p3': 'Отступ задаёт CSS. Здесь числа пишут переменные --sticky-aside-top и --sticky-aside-bottom. С Tailwind вместо них передают top-16 md:top-24.',
    'article.p4': 'Замок держит панель на той высоте окна, где она была в момент включения. Если колонка уехала и замок больше не попадает в неё, панель возвращается внутрь колонки.',
    'article.p5': 'Ядро не знает про Vue, React и Svelte. Адаптер отдаёт ему два элемента и слушает пропсы.',
    'article.p6': 'Измерение делает невидимая планка. Она приклеена к окну между верхним и нижним отступом, а её высота не больше высоты панели.',
    'article.p7': 'Слушатель висит на window. Вложенный скролл контейнера эта версия не обрабатывает.',
    'article.p8': 'Ширина зафиксированной панели берётся у колонки. Иначе fixed выскочит из сетки и растянется на весь экран.',
  },
}

export function t(locale: DemoLocale, key: string): string {
  return messages[locale][key] ?? key
}

export function stateReadout(
  locale: DemoLocale,
  state: StickyAsideState,
  isScrolling: boolean,
  isScrollingUp: boolean,
): string {
  const key = state === 'flow' && isScrolling
    ? (isScrollingUp ? 'state.flowUp' : 'state.flowDown')
    : `state.${state}`

  return t(locale, key)
}

export function articleLines(locale: DemoLocale): string[] {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((index) => t(locale, `article.p${index}`))
}

export function frameworkPath(framework: DemoFramework): string {
  return framework === 'vanilla' ? '/' : `/${framework}`
}

function normalizeBase(base: string): string {
  if (base === '/') {
    return ''
  }

  return base.endsWith('/') ? base.slice(0, -1) : base
}

function readBase(base?: string): string {
  if (base !== undefined) {
    return base
  }

  const value = import.meta.env.BASE_URL

  return typeof value === 'string' ? value : '/'
}

export function sitePath(path: string, base?: string): string {
  const prefix = normalizeBase(readBase(base))
  if (prefix.length === 0) {
    return path
  }
  if (path === prefix) {
    return '/'
  }
  if (path.startsWith(`${prefix}/`)) {
    const rest = path.slice(prefix.length)

    return rest.length > 0 ? rest : '/'
  }

  return path
}

export function withBase(path: string, base?: string): string {
  const prefix = normalizeBase(readBase(base))
  const clean = path.startsWith('/') ? path : `/${path}`
  if (prefix.length === 0) {
    return clean
  }

  return clean === '/' ? `${prefix}/` : `${prefix}${clean}`
}

export function frameworkFromPath(path: string, base?: string): DemoFramework {
  const stripped = sitePath(path, base).replace(/^\/ru(?=\/|$)/, '') || '/'
  const segment = stripped.replace(/^\/+|\/+$/g, '')
  if (segment === 'vue' || segment === 'react' || segment === 'svelte') {
    return segment
  }

  return 'vanilla'
}

export function localePath(locale: DemoLocale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === 'ru') {
    return clean === '/' ? '/ru/' : `/ru${clean}`
  }

  return clean
}

export function switchLocalePath(locale: DemoLocale, path: string, base?: string): string {
  const current = sitePath(path, base)
  if (locale === 'ru') {
    const stripped = current.replace(/^\/ru(?=\/|$)/, '')

    return stripped.length > 0 ? stripped : '/'
  }
  if (current === '/') {
    return '/ru/'
  }

  return `/ru${current}`
}
