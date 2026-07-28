import type { Term } from '../types'
import { CATEGORY_STYLE } from '../lib/categoryColors'
import { highlight } from '../lib/highlight'

interface Props {
  term: Term
  query: string
  selected: boolean
  onOpen: () => void
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function TermCard({ term, query, selected, onOpen, isBookmarked, onToggleBookmark }: Props) {
  return (
    <div className="relative">
      <button
        onClick={onOpen}
        data-selected={selected}
        className={`block w-full rounded-xl border p-4 pr-10 text-left transition ${
          selected
            ? 'border-slate-500 ring-2 ring-slate-300 dark:border-slate-400 dark:ring-slate-700'
            : 'border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-semibold">{highlight(term.term, query)}</span>
          <span className="text-sm text-slate-400">{highlight(term.termEn, query)}</span>
        </div>
        <p className="mt-1.5 text-slate-600 dark:text-slate-300">
          {highlight(term.oneLiner, query)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[term.category]}`}>
            {term.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {term.level}
          </span>
        </div>
      </button>

      <button
        onClick={() => onToggleBookmark(term.id)}
        aria-label={isBookmarked ? '북마크 해제' : '북마크'}
        title={isBookmarked ? '북마크 해제' : '북마크'}
        className="absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-lg leading-none text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
      >
        {isBookmarked ? '★' : '☆'}
      </button>
    </div>
  )
}
