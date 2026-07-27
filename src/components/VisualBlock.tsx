import { useState } from 'react'
import type { Visual } from '../types'
import { getSvg, COMPONENTS } from '../lib/visuals'

interface Props {
  visual: Visual
}

export function VisualBlock({ visual }: Props) {
  const [zoomed, setZoomed] = useState(false)

  const inner = renderInner(visual, () => setZoomed(true))
  if (!inner) return null

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {inner}
      {visual.caption && (
        <figcaption className="mt-2 text-center text-xs text-slate-500">
          {visual.caption}
        </figcaption>
      )}

      {zoomed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="시각 자료 확대"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {renderInner(visual, undefined)}
            <button
              onClick={() => setZoomed(false)}
              className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </figure>
  )
}

// onZoom이 있으면 클릭 시 확대(정적 그림에만). 컴포넌트는 상호작용이 있어 확대 비활성.
function renderInner(visual: Visual, onZoom?: () => void) {
  if (visual.type === 'svg') {
    const svg = getSvg(visual.src)
    if (!svg) return null
    return (
      <button
        type="button"
        onClick={onZoom}
        aria-label={onZoom ? '그림 확대' : undefined}
        className={`block w-full ${onZoom ? 'cursor-zoom-in' : 'cursor-default'}`}
        // 인라인 SVG: currentColor/CSS변수가 상속되어 다크모드 자동 대응
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  if (visual.type === 'component') {
    const Comp = visual.name ? COMPONENTS[visual.name] : undefined
    if (!Comp) return null
    return <Comp />
  }

  // ponytail: mermaid 쓰는 용어가 아직 없어 라이브러리 미설치. 생기면 mermaid 렌더 추가.
  if (visual.type === 'mermaid') {
    return (
      <pre className="overflow-x-auto rounded-md bg-slate-100 p-3 text-xs dark:bg-slate-800">
        {visual.code}
      </pre>
    )
  }

  return null
}
