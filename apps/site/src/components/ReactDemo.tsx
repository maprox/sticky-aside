import { StickyAside } from '@sticky-aside/react'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

import { articleLines, paragraphs } from '#site/demo/copy'

export function ReactDemo() {
  const [offsetTop, setOffsetTop] = useState(16)
  const [offsetBottom, setOffsetBottom] = useState(16)
  const [isLocked, setLocked] = useState(false)
  const [isTall, setTall] = useState(true)
  const railStyle = {
    '--sticky-aside-top': `${offsetTop}px`,
    '--sticky-aside-bottom': `${offsetBottom}px`,
  } as CSSProperties

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [offsetTop, offsetBottom])

  return (
    <>
      <h2 className="sandbox-title">React</h2>
      <div className="demo">
        <article className="article">
          {articleLines.map((line, index) => <p key={index}>{line}</p>)}
        </article>
        <div className="rail" style={railStyle}>
          <StickyAside locked={isLocked}>
            <div className="panel">
              <span className="clip" />
              <p className="panel-kicker">React</p>
              <p>
                {isTall
                  ? 'Панель выше окна. Крутите страницу в обе стороны.'
                  : 'Панель короче окна и остаётся сверху.'}
              </p>
              {isTall && (
                <ol>
                  {paragraphs.slice(0, 8).map((line) => <li key={line}>{line}</li>)}
                </ol>
              )}
              <div className="controls">
                <label>
                  Отступ сверху
                  <input
                    type="number"
                    min={0}
                    value={offsetTop}
                    onChange={(event) => setOffsetTop(Number(event.target.value) || 0)}
                  />
                </label>
                <label>
                  Отступ снизу
                  <input
                    type="number"
                    min={0}
                    value={offsetBottom}
                    onChange={(event) => setOffsetBottom(Number(event.target.value) || 0)}
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={isLocked}
                    onChange={(event) => setLocked(event.target.checked)}
                  /> Замок
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={isTall}
                    onChange={(event) => setTall(event.target.checked)}
                  /> Длинная панель
                </label>
              </div>
            </div>
          </StickyAside>
        </div>
      </div>
    </>
  )
}
