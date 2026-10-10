<script lang="ts">
  import { StickyAside } from '@sticky-aside/svelte'

  import { record } from './record.ts'

  let locked = $state(false)
  let disabled = $state(false)
  let overflowTop = $state(false)
  let overflowBottom = $state(false)

  document.querySelector('#lock')?.addEventListener('click', () => {
    locked = !locked
  })
  document.querySelector('#disable')?.addEventListener('click', () => {
    disabled = !disabled
  })
  document.querySelector('#overflow-top')?.addEventListener('click', () => {
    overflowTop = !overflowTop
  })
  document.querySelector('#overflow-bottom')?.addEventListener('click', () => {
    overflowBottom = !overflowBottom
  })
</script>

<StickyAside
  {locked}
  {disabled}
  allowLockedOverflowTop={overflowTop}
  allowLockedOverflowBottom={overflowBottom}
  onStateChange={record}
>
  <div class="panel"></div>
</StickyAside>
