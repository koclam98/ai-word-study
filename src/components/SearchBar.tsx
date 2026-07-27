import { forwardRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange },
  ref,
) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="용어 검색 — 한글·영문·별칭·초성(ㅇㅂㄷ) 다 됩니다"
        aria-label="용어 검색"
        className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-lg shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-slate-700"
      />
    </div>
  )
})
