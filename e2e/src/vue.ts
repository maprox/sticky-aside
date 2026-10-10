import { createApp } from 'vue'

import App from './App.vue'

export function mount(column: HTMLElement) {
  createApp(App).mount(column)
}
