import type { DemoFramework, DemoLocale } from '#site/demo/settings.ts'

export interface LandingContent {
  installation: { title: string, command: string, body: string }
  explanation: { title: string, paragraphs: string[] }
  integration: {
    title: string
    body: string
    docsHref: string
    docsLabel: string
    npmHref: string
    npmLabel: string
  }
  limitations: { title: string, items: string[] }
}

const frameworkNames: Record<DemoFramework, string> = {
  vanilla: 'Vanilla JS',
  vue: 'Vue 3',
  react: 'React',
  svelte: 'Svelte 5',
  solid: 'Solid',
  astro: 'Astro',
  angular: 'Angular 19',
}

const packageNames: Record<DemoFramework, string> = {
  vanilla: '@sticky-aside/core',
  vue: '@sticky-aside/vue',
  react: '@sticky-aside/react',
  svelte: '@sticky-aside/svelte',
  solid: '@sticky-aside/solid',
  astro: '@sticky-aside/astro',
  angular: '@sticky-aside/angular',
}

const packageDirectories: Record<DemoFramework, string> = {
  vanilla: 'core',
  vue: 'vue',
  react: 'react',
  svelte: 'svelte',
  solid: 'solid',
  astro: 'astro',
  angular: 'angular',
}

const integrationCopy: Record<DemoLocale, Record<DemoFramework, string>> = {
  en: {
    vanilla: [
      'Call createStickyAside from @sticky-aside/core with separate wrapper and content elements.',
      'Import offsets.css for the default offset classes, or provide topClass and bottomClass yourself.',
    ].join(' '),
    vue: [
      'Use the StickyAside component in Vue 3 and choose the rendered element with the as prop.',
      'When scoped styles target custom offset classes, reach the generated inner and measurement nodes with :deep.',
    ].join(' '),
    react: [
      'Render StickyAside from the React package and pass topClass and bottomClass as camelCase props.',
      'You can instead import offsets.css once and set --sticky-aside-top on a layout ancestor.',
    ].join(' '),
    svelte: [
      'Use StickyAside in Svelte 5 with custom topClass and bottomClass props or the shared offsets stylesheet.',
      'Scoped styles must target generated offset elements with :global; importing offsets.css avoids that requirement.',
    ].join(' '),
    solid: [
      'The Solid adapter exposes the StickyAside component with topClass and bottomClass props.',
      'For the stylesheet-based setup, import offsets.css once and define the CSS variables on a layout ancestor.',
    ].join(' '),
    astro: [
      'Import createStickyAside from @sticky-aside/astro inside a client script in your .astro file.',
      'It re-exports the vanilla API, so initialization receives the wrapper and content elements directly.',
    ].join(' '),
    angular: [
      'Register the standalone StickyAside component in an Angular 19 component\'s imports array.',
      'Use topClass and bottomClass attributes or the shared offsets stylesheet; stateChange reports sticky state changes.',
    ].join(' '),
  },
  ru: {
    vanilla: [
      'Вызовите createStickyAside из @sticky-aside/core и передайте отдельные элементы wrapper и content.',
      'Подключите offsets.css для стандартных классов отступов или задайте собственные topClass и bottomClass.',
    ].join(' '),
    vue: [
      'Используйте компонент StickyAside во Vue 3, а HTML-элемент выберите через проп as.',
      'Если scoped-стили задают собственные классы отступов, обращайтесь к внутренним и измерительным узлам через :deep.',
    ].join(' '),
    react: [
      'Отрисуйте StickyAside из React-пакета и передайте пропсы topClass и bottomClass в camelCase.',
      'Другой вариант — один раз подключить offsets.css и задать --sticky-aside-top у родительского элемента раскладки.',
    ].join(' '),
    svelte: [
      'Используйте StickyAside в Svelte 5 с пропсами topClass и bottomClass или общим offsets.css.',
      'Scoped-стили должны обращаться к создаваемым элементам через :global; подключение offsets.css снимает это требование.',
    ].join(' '),
    solid: [
      'Адаптер Solid предоставляет компонент StickyAside с пропсами topClass и bottomClass.',
      'При использовании общей таблицы стилей подключите offsets.css и задайте CSS-переменные у родителя раскладки.',
    ].join(' '),
    astro: [
      'Импортируйте createStickyAside из @sticky-aside/astro в клиентском script внутри .astro-файла.',
      'Пакет повторно экспортирует API vanilla, поэтому при инициализации передаются элементы wrapper и content.',
    ].join(' '),
    angular: [
      'Добавьте standalone-компонент StickyAside в массив imports компонента Angular 19.',
      'Задайте атрибуты topClass и bottomClass или подключите offsets.css; событие stateChange сообщает о смене состояния.',
    ].join(' '),
  },
}

const sharedCopy = {
  en: {
    installationTitle: 'Installation',
    installationBody: [
      'Install the package that matches your framework.',
      'The interactive example above uses the same package and shows the minimal markup and initialization.',
    ].join(' '),
    explanationTitle: 'Why sticky-aside',
    explanation: [
      [
        'Native position: sticky can pin a panel to one edge, but a panel taller than the viewport can leave',
        'part of its content difficult to reach. sticky-aside lets the panel travel with the page and pins',
        'the edge toward which the visitor is scrolling.',
      ].join(' '),
      [
        'The wrapper stays in the document layout while the content moves within its column.',
        'CSS variables or utility classes define the top and bottom gaps, and a short panel simply remains at the top.',
      ].join(' '),
    ],
    integrationTitle: 'integration',
    docsLabel: 'Read the package guide',
    npmLabel: 'View the package on npm',
    limitationsTitle: 'Browser support and limitations',
    limitations: [
      'Designed for modern browsers; the library does not provide legacy-browser polyfills.',
      'Scrolling is tracked on window; nested container scrolling is outside this version\'s scope.',
      'The panel remains constrained by its column, so the layout needs a wrapper with room for the panel to travel.',
    ],
  },
  ru: {
    installationTitle: 'Установка',
    installationBody: [
      'Установите пакет для своего фреймворка.',
      'Интерактивный пример выше использует тот же пакет и показывает минимальную разметку и инициализацию.',
    ].join(' '),
    explanationTitle: 'Почему sticky-aside',
    explanation: [
      [
        'Обычный position: sticky фиксирует панель у одного края, но у панели выше окна часть содержимого',
        'может оказаться труднодоступной. sticky-aside позволяет панели двигаться вместе со страницей',
        'и фиксирует тот край, к которому прокручивает посетитель.',
      ].join(' '),
      [
        'Обертка остаётся в раскладке документа, а содержимое движется в пределах своей колонки.',
        'Верхний и нижний отступы задают CSS-переменные или utility-классы; короткая панель просто остаётся сверху.',
      ].join(' '),
    ],
    integrationTitle: 'Интеграция с',
    docsLabel: 'Документация пакета',
    npmLabel: 'Страница пакета в npm',
    limitationsTitle: 'Поддержка браузеров и ограничения',
    limitations: [
      'Библиотека рассчитана на современные браузеры и не содержит полифилов для устаревших.',
      'Отслеживается прокрутка window; прокрутка вложенных контейнеров не поддерживается в этой версии.',
      'Панель ограничена своей колонкой, поэтому в раскладке нужна обертка с достаточным пространством для движения.',
    ],
  },
} as const

export function landingContent(locale: DemoLocale, framework: DemoFramework): LandingContent {
  const copy = sharedCopy[locale]
  const packageName = packageNames[framework]
  const frameworkName = frameworkNames[framework]
  const integrationTitle = locale === 'ru'
    ? `${copy.integrationTitle} ${frameworkName}`
    : `${frameworkName} ${copy.integrationTitle}`

  return {
    installation: {
      title: copy.installationTitle,
      command: `npm install ${packageName}`,
      body: copy.installationBody,
    },
    explanation: {
      title: copy.explanationTitle,
      paragraphs: [...copy.explanation],
    },
    integration: {
      title: integrationTitle,
      body: integrationCopy[locale][framework],
      docsHref: `https://github.com/maprox/sticky-aside/tree/main/packages/${packageDirectories[framework]}#readme`,
      docsLabel: copy.docsLabel,
      npmHref: `https://www.npmjs.com/package/${packageName}`,
      npmLabel: copy.npmLabel,
    },
    limitations: {
      title: copy.limitationsTitle,
      items: [...copy.limitations],
    },
  }
}
