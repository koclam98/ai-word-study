import { CATEGORIES, type Category, type Level } from '../types'
import { CATEGORY_STYLE } from '../lib/categoryColors'

interface Props {
  category: Category | null
  level: Level | null
  counts: Record<Category, number>
  total: number
  grouped: boolean
  onChange: (patch: { category?: Category | null; level?: Level | null }) => void
  onToggleGroup: () => void
}

export function FilterBar({ category, level, counts, total, grouped, onChange, onToggleGroup }: Props) {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip active={category === null} onClick={() => onChange({ category: null })}>
          전체 <Count>{total}</Count>
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={category === c}
            colorClass={CATEGORY_STYLE[c]}
            onClick={() => onChange({ category: category === c ? null : c })}
          >
            {c} <Count>{counts[c] ?? 0}</Count>
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={level === '기초'}
            onChange={(e) => onChange({ level: e.target.checked ? '기초' : null })}
            className="h-4 w-4 rounded border-slate-300 accent-slate-600"
          />
          기초만 보기
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={grouped}
            onChange={onToggleGroup}
            className="h-4 w-4 rounded border-slate-300 accent-slate-600"
          />
          카테고리별 묶어 보기
        </label>
      </div>
    </div>
  )
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="opacity-60">{children}</span>
}

function Chip({
  active,
  colorClass,
  onClick,
  children,
}: {
  active: boolean
  colorClass?: string
  onClick: () => void
  children: React.ReactNode
}) {
  const base = 'rounded-full px-3 py-1 text-sm font-medium transition border'
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`${base} border-slate-800 bg-slate-800 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900`}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      className={`${base} border-transparent ${colorClass ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'} hover:opacity-80`}
    >
      {children}
    </button>
  )
}
