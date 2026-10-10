import '@sticky-aside/core/offsets.css'
import './styles.css'

const params = new URLSearchParams(location.search)
const runtime = params.get('runtime') ?? 'vanilla'
const top = params.get('top') ?? '16'
const bottom = params.get('bottom') ?? '16'
const tall = params.get('tall') === '1'

document.body.dataset.runtime = runtime
document.body.dataset.tall = tall ? '1' : '0'

const column = document.querySelector<HTMLElement>('#column')
if (!column) {
  throw new Error('Missing column')
}

column.style.setProperty('--sticky-aside-top', `${top}px`)
column.style.setProperty('--sticky-aside-bottom', `${bottom}px`)

const loaders = {
  vanilla: () => import('./vanilla.ts'),
  vue: () => import('./vue.ts'),
  react: () => import('./react.tsx'),
  svelte: () => import('./svelte.ts'),
}

const load = loaders[runtime as keyof typeof loaders]
if (!load) {
  throw new Error(`Unknown runtime ${runtime}`)
}

await load().then((mod) => mod.mount(column))
