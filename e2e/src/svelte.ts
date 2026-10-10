import { mount as mountSvelte } from 'svelte'

import Panel from './Panel.svelte'

export function mount(column: HTMLElement) {
  mountSvelte(Panel, { target: column })
}
