import type { Term, Roadmap } from '../types'
import { CATEGORY_STYLE } from '../lib/categoryColors'

interface Props {
  terms: Term[]
  byId: Map<string, Term>
  roadmaps: Roadmap[]
  recent: string[]
  bookmarks: string[]
  onOpen: (id: string) => void
}

// 날짜 기반 결정적 '오늘의 용어' (하루 동안 고정)
function pickTodayTerm(terms: Term[]): Term {
  const now = new Date()
  const dayNum = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  )
  return terms[dayNum % terms.length]
}

export function Landing({ terms, byId, roadmaps, recent, bookmarks, onOpen }: Props) {
  const today = pickTodayTerm(terms)

  return (
    <div className="mt-6 space-y-8">
      {/* 오늘의 용어 */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          오늘의 용어
        </h2>
        <button
          onClick={() => onOpen(today.id)}
          className="block w-full rounded-xl border border-slate-200 p-5 text-left transition hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-bold">{today.term}</span>
            <span className="text-sm text-slate-400">{today.termEn}</span>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[today.category]}`}>
              {today.category}
            </span>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{today.oneLiner}</p>
        </button>
      </section>

      {/* 최근 본 용어 */}
      {recent.length > 0 && (
        <ChipSection label="최근 본 용어" ids={recent} byId={byId} onOpen={onOpen} />
      )}

      {/* 북마크 */}
      {bookmarks.length > 0 && (
        <ChipSection label="북마크 ★" ids={bookmarks} byId={byId} onOpen={onOpen} />
      )}

      {/* 학습 로드맵 */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          학습 로드맵
        </h2>
        <div className="space-y-4">
          {roadmaps.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold">{r.title}</p>
              <p className="mb-3 text-sm text-slate-500">{r.description}</p>
              <ol className="flex flex-wrap items-center gap-1.5">
                {r.steps.map((id, i) => {
                  const t = byId.get(id)
                  if (!t) return null
                  return (
                    <li key={id} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-slate-300 dark:text-slate-600">→</span>}
                      <button
                        onClick={() => onOpen(id)}
                        className="rounded-full border border-slate-300 px-2.5 py-1 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        {t.term}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ChipSection({
  label,
  ids,
  byId,
  onOpen,
}: {
  label: string
  ids: string[]
  byId: Map<string, Term>
  onOpen: (id: string) => void
}) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h2>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const t = byId.get(id)
          if (!t) return null
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {t.term}
            </button>
          )
        })}
      </div>
    </section>
  )
}
