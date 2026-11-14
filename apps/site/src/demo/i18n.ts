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
    'seo.vanilla.h1': 'JavaScript sticky sidebar for scroll layouts',
    'seo.vanilla.description': 'A lightweight JavaScript sticky sidebar for tall panels, with two-way scrolling, CSS offsets, and adapters for React, Vue, Svelte, Solid, Astro, and Angular.',
    'seo.vue.title': 'Vue sticky sidebar for Vue 3 — sticky-aside',
    'seo.vue.h1': 'Vue sticky sidebar for Vue 3',
    'seo.vue.description': 'A Vue 3 sticky sidebar component for tall panels, with two-way scrolling, lock mode, and CSS offsets. Supports custom classes and scoped styles.',
    'seo.react.title': 'React sticky sidebar — sticky-aside',
    'seo.react.h1': 'React sticky sidebar',
    'seo.react.description': 'A React sticky sidebar component for tall panels, with two-way scrolling, lock mode, and CSS offsets. Use utility classes or the shared stylesheet.',
    'seo.svelte.title': 'Svelte sticky sidebar — sticky-aside',
    'seo.svelte.h1': 'Svelte sticky sidebar',
    'seo.svelte.description': 'A Svelte 5 sticky sidebar component for tall panels, with two-way scrolling, lock mode, and CSS offsets. Works with :global or the shared offsets stylesheet.',
    'seo.solid.title': 'Solid sticky sidebar — sticky-aside',
    'seo.solid.h1': 'Solid sticky sidebar',
    'seo.solid.description': 'A Solid sticky sidebar component for tall panels, with two-way scrolling, lock mode, and CSS offsets. Use custom classes or the shared stylesheet.',
    'seo.astro.title': 'Astro sticky sidebar — sticky-aside',
    'seo.astro.h1': 'Astro sticky sidebar',
    'seo.astro.description': 'A sticky sidebar for Astro with the vanilla createStickyAside API, two-way scrolling for tall panels, lock mode, and CSS offsets in a client script.',
    'seo.angular.title': 'Angular sticky sidebar — sticky-aside',
    'seo.angular.h1': 'Angular sticky sidebar',
    'seo.angular.description': 'An Angular 19 sticky sidebar component for tall panels, with two-way scrolling, lock mode, CSS offsets, and stateChange events for modern browser layouts.',
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
    'panel.demo.1': 'Scroll down: the panel pins its bottom edge to the window.',
    'panel.demo.2': 'Scroll up: it releases and pins its top edge instead.',
    'panel.demo.3': 'Between those moments the panel just rides with the page.',
    'panel.demo.4': 'Drag the lower edge of the window to change its height.',
    'panel.demo.5': 'Turn off the tall switch to compare with a short panel.',
    'panel.demo.6': 'Lock holds the panel at the height where you turned it on.',
    'article.p1': 'A short panel stays at the top of the window. A tall one rides with the page until the edge you scroll toward meets the screen.',
    'article.p2': 'Scrolling down pins the bottom of the panel to the bottom of the window. Scrolling up releases it and pins the top. Between those moments the panel just sits in its column.',
    'article.p3': 'Offsets come from CSS. Here the numbers write --sticky-aside-top and --sticky-aside-bottom. With Tailwind you pass top-16 md:top-24 instead.',
    'article.p4': 'Lock holds the panel at the window height where you turned it on. If the column leaves and the lock no longer fits, the panel returns inside the column.',
    'article.p5': 'The core does not know Vue, React, Svelte, Solid, Astro, or Angular. An adapter hands it two elements and listens to props.',
    'article.p6': 'Measurement is an invisible rail glued to the window between the top and bottom offsets, never taller than the panel. That is how the core knows whether the panel fits.',
    'article.p7': 'The listener hangs on window. Nested container scroll is out of scope for this version.',
    'article.p8': 'A fixed panel takes its width from the column. Otherwise it jumps the grid and stretches across the screen.',
    'article.p9': 'It fits documentation layouts, article pages with a tall table of contents, and dashboards where a sidebar must stay reachable in both scroll directions.',
    'article.p10': 'The package is a small ESM module with TypeScript types. The core has no framework code; the adapters only map props to it.',
    'article.p11': 'If you come from sticky-sidebar, the mental model changes: the wrapper stays in the layout and the panel, not the whole aside, is what moves.',
    'article.p12': 'Skip it when the page barely scrolls, when the scrollable area is a nested container, or when plain position: sticky already covers a short panel.',
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
    'seo.vanilla.title': 'Sticky sidebar для JavaScript — sticky-aside',
    'seo.vanilla.h1': 'Sticky sidebar для JavaScript — прилипающая боковая панель',
    'seo.vanilla.description': 'Sticky sidebar для JavaScript: прилипающая боковая панель с прокруткой в обе стороны, CSS-отступами и адаптерами для React, Vue, Svelte, Solid, Astro и Angular.',
    'seo.vue.title': 'Sticky sidebar для Vue 3 — sticky-aside',
    'seo.vue.h1': 'Sticky sidebar для Vue 3',
    'seo.vue.description': 'Компонент sticky sidebar для Vue 3: прокрутка высокой панели в обе стороны, режим фиксации и CSS-отступы. Поддерживает scoped-стили через :deep.',
    'seo.react.title': 'React sticky sidebar — sticky-aside',
    'seo.react.h1': 'Sticky sidebar для React',
    'seo.react.description': 'Компонент sticky sidebar для React: прокрутка высокой панели в обе стороны, режим фиксации и CSS-отступы через пропсы или общую таблицу стилей.',
    'seo.svelte.title': 'Sticky sidebar для Svelte 5 — sticky-aside',
    'seo.svelte.h1': 'Sticky sidebar для Svelte 5',
    'seo.svelte.description': 'Компонент sticky sidebar для Svelte 5: прокрутка высокой панели в обе стороны, режим фиксации и CSS-отступы через :global или offsets.css.',
    'seo.solid.title': 'Solid sticky sidebar — sticky-aside',
    'seo.solid.h1': 'Sticky sidebar для Solid',
    'seo.solid.description': 'Компонент sticky sidebar для Solid: прокрутка высокой панели в обе стороны, режим фиксации и CSS-отступы через пропсы или общую таблицу стилей.',
    'seo.astro.title': 'Astro sticky sidebar — sticky-aside',
    'seo.astro.h1': 'Sticky sidebar для Astro',
    'seo.astro.description': 'Sticky sidebar для Astro с API createStickyAside: прокрутка высокой панели в обе стороны, режим фиксации и CSS-отступы в клиентском script.',
    'seo.angular.title': 'Sticky sidebar для Angular 19 — sticky-aside',
    'seo.angular.h1': 'Sticky sidebar для Angular 19',
    'seo.angular.description': 'Компонент sticky sidebar для Angular 19: прокрутка высокой панели в обе стороны, режим фиксации, CSS-отступы и событие stateChange.',
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
    'panel.demo.1': 'Скролл вниз: панель фиксирует нижний край у окна.',
    'panel.demo.2': 'Скролл вверх: она отпускается и фиксирует верхний.',
    'panel.demo.3': 'Между этими моментами панель просто едет со страницей.',
    'panel.demo.4': 'Потяните нижний край окна, чтобы изменить его высоту.',
    'panel.demo.5': 'Выключите «Длинная панель», чтобы сравнить с короткой.',
    'panel.demo.6': 'Замок удерживает панель на высоте, где его включили.',
    'article.p1': 'Короткая панель остаётся у верхнего края окна. Длинная едет вместе со страницей, пока край, к которому вы скроллите, не упрётся в экран.',
    'article.p2': 'Скролл вниз прижимает низ панели к низу окна. Скролл вверх отпускает её и прижимает верх. Между этими моментами панель просто стоит в колонке.',
    'article.p3': 'Отступ задаёт CSS. Здесь числа пишут переменные --sticky-aside-top и --sticky-aside-bottom. С Tailwind вместо них передают top-16 md:top-24.',
    'article.p4': 'Замок держит панель на той высоте окна, где она была в момент включения. Если колонка уехала и замок больше не попадает в неё, панель возвращается внутрь колонки.',
    'article.p5': 'Ядро не знает про Vue, React, Svelte, Solid, Astro и Angular. Адаптер отдаёт ему два элемента и слушает пропсы.',
    'article.p6': 'Измерение делает невидимая планка. Она приклеена к окну между верхним и нижним отступом, а её высота не больше высоты панели.',
    'article.p7': 'Слушатель висит на window. Вложенный скролл контейнера эта версия не обрабатывает.',
    'article.p8': 'Ширина зафиксированной панели берётся у колонки. Иначе fixed выскочит из сетки и растянется на весь экран.',
    'article.p9': 'Подходит для документации, статей с длинным оглавлением и дашбордов, где боковая панель должна оставаться доступной при прокрутке в обе стороны.',
    'article.p10': 'Пакет — компактный ESM-модуль с типами TypeScript. Ядро не знает про фреймворки, адаптеры лишь связывают его с пропсами.',
    'article.p11': 'Если вы переходите со sticky-sidebar, поменяется модель: обертка остаётся в раскладке, а двигается только панель, не весь aside.',
    'article.p12': 'Не нужен на страницах с коротким скроллом, во вложенных прокручиваемых контейнерах и когда обычного position: sticky хватает для короткой панели.',
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
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => t(locale, `article.p${index}`))
}

export function panelDemoLines(locale: DemoLocale): string[] {
  return [1, 2, 3, 4, 5, 6].map((index) => t(locale, `panel.demo.${index}`))
}

export function frameworkPath(framework: DemoFramework): string {
  return framework === 'vanilla' ? '/' : `/${framework}/`
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
  if (
    segment === 'vue' ||
    segment === 'react' ||
    segment === 'svelte' ||
    segment === 'solid' ||
    segment === 'astro' ||
    segment === 'angular'
  ) {
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
