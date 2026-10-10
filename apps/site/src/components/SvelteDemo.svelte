<script lang="ts">
  import StickyAside from '@sticky-aside/svelte'
  import { articleLines, paragraphs } from '../demo/copy'

  let offsetTop = $state(16)
  let offsetBottom = $state(16)
  let locked = $state(false)
  let tall = $state(true)

  $effect(() => {
    offsetTop
    offsetBottom
    window.dispatchEvent(new Event('resize'))
  })
</script>

<h2 class="sandbox-title">Svelte</h2>
<div class="demo">
  <article class="article">
    {#each articleLines as line, index}
      <p>{line}</p>
    {/each}
  </article>
  <div
    class="rail"
    style:--sticky-aside-top="{offsetTop}px"
    style:--sticky-aside-bottom="{offsetBottom}px"
  >
    <StickyAside {locked}>
      <div class="panel">
        <span class="clip"></span>
        <p class="panel-kicker">Svelte</p>
        <p>
          {tall
            ? 'Панель выше окна. Крутите страницу в обе стороны.'
            : 'Панель короче окна и остаётся сверху.'}
        </p>
        {#if tall}
          <ol>
            {#each paragraphs.slice(0, 8) as line}
              <li>{line}</li>
            {/each}
          </ol>
        {/if}
        <div class="controls">
          <label>Отступ сверху <input type="number" min="0" bind:value={offsetTop} /></label>
          <label>Отступ снизу <input type="number" min="0" bind:value={offsetBottom} /></label>
          <label><input type="checkbox" bind:checked={locked} /> Замок</label>
          <label><input type="checkbox" bind:checked={tall} /> Длинная панель</label>
        </div>
      </div>
    </StickyAside>
  </div>
</div>
