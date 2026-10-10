import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { StickyAside } from '@sticky-aside/react'

import { record } from './record.ts'

function App() {
  const [locked, setLocked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [overflowTop, setOverflowTop] = useState(false)
  const [overflowBottom, setOverflowBottom] = useState(false)

  useEffect(() => {
    const lock = document.querySelector('#lock')
    const disable = document.querySelector('#disable')
    const overflowTopButton = document.querySelector('#overflow-top')
    const overflowBottomButton = document.querySelector('#overflow-bottom')
    const onLock = () => setLocked((value) => !value)
    const onDisable = () => setDisabled((value) => !value)
    const onOverflowTop = () => setOverflowTop((value) => !value)
    const onOverflowBottom = () => setOverflowBottom((value) => !value)
    lock?.addEventListener('click', onLock)
    disable?.addEventListener('click', onDisable)
    overflowTopButton?.addEventListener('click', onOverflowTop)
    overflowBottomButton?.addEventListener('click', onOverflowBottom)
    return () => {
      lock?.removeEventListener('click', onLock)
      disable?.removeEventListener('click', onDisable)
      overflowTopButton?.removeEventListener('click', onOverflowTop)
      overflowBottomButton?.removeEventListener('click', onOverflowBottom)
    }
  }, [])

  return (
    <StickyAside
      locked={locked}
      disabled={disabled}
      allowLockedOverflowTop={overflowTop}
      allowLockedOverflowBottom={overflowBottom}
      onStateChange={record}
    >
      <div className="panel" />
    </StickyAside>
  )
}

export function mount(column: HTMLElement) {
  createRoot(column).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
