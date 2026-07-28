import type { Term } from '../types'
import { CATEGORY_STYLE } from '../lib/categoryColors'

interface Props {
  a: Term
  b: Term
  note: string // 두 개념의 핵심 차이
  onClose: () => void
}

export function CompareView({ a, b, note, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${a.term} 와 ${b.term} 비교`}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">헷갈리는 개념 비교</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* 핵심 차이 */}
        <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-slate-700 dark:bg-amber-500/10 dark:text-slate-200">
          ⚖️ {note}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {[a, b].map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <span className="text-base font-semibold">{t.term}</span>
                <span className="text-xs text-slate-400">{t.termEn}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[t.category]}`}>
                  {t.category}
                </span>
              </div>
              <p className="mb-2 font-medium text-slate-800 dark:text-slate-100">{t.oneLiner}</p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
