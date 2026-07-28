import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import termsData from './data/terms.json'
import roadmapsData from './data/roadmaps.json'
import { type Term, type Roadmap, type Category, CATEGORIES } from './types'
import { createSearcher } from './lib/search'
import { useUrlState } from './lib/url'
import { useDarkMode } from './lib/useDarkMode'
import { useLocalList } from './lib/useLocalList'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { TermCard } from './components/TermCard'
import { TermDetail } from './components/TermDetail'
import { Landing } from './components/Landing'

const TERMS = termsData as Term[]
const ROADMAPS = roadmapsData as Roadmap[]
const BY_ID = new Map(TERMS.map((t) => [t.id, t]))
const ISSUE_URL = 'https://github.com/koclam98/ai-word-study/issues/new/choose'

// 카테고리별 용어 수 (칩 뱃지용) — 정적이라 모듈 로드 시 1회 계산
const COUNTS = TERMS.reduce(
  (acc, t) => ((acc[t.category] = (acc[t.category] ?? 0) + 1), acc),
  {} as Record<Category, number>,
)

export default function App() {
  const searcher = useMemo(() => createSearcher(TERMS), [])
  const [query, setQuery] = useState('')
  const [dark, toggleDark] = useDarkMode()
  const [url, setUrl] = useUrlState()
  const [selected, setSelected] = useState(0)
  const [grouped, setGrouped] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { list: bookmarks, toggle: toggleBookmark, has: isBookmarked } = useLocalList(
    'ai-glossary:bookmarks',
  )
  const { list: recent, pushRecent } = useLocalList('ai-glossary:recent')

  // 검색 → 필터
  const results = useMemo(() => {
    let list = searcher(query)
    if (url.category) list = list.filter((t) => t.category === url.category)
    if (url.level) list = list.filter((t) => t.level === url.level)
    return list
  }, [searcher, query, url.category, url.level])

  // 그룹 보기면 카테고리 순으로 정렬(선택 인덱스도 이 순서를 따름)
  const ordered = useMemo(() => {
    if (!grouped) return results
    return [...results].sort(
      (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category),
    )
  }, [results, grouped])

  const openTerm = BY_ID.get(url.termId ?? '') ?? null
  const showLanding = !query && !url.category && !url.level

  const open = useCallback(
    (id: string) => {
      setUrl({ termId: id })
      pushRecent(id)
    },
    [setUrl, pushRecent],
  )
  const close = useCallback(() => setUrl({ termId: null }), [setUrl])

  useEffect(() => {
    setSelected(0)
  }, [ordered])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 전역 키보드 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && url.termId) {
        e.preventDefault()
        close()
        return
      }
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
        return
      }
      if (url.termId) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((i) => Math.min(i + 1, ordered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && ordered[selected]) {
        e.preventDefault()
        open(ordered[selected].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ordered, selected, url.termId, open, close])

  useEffect(() => {
    document
      .querySelector<HTMLElement>('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI 용어 사전</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              사내 누구나 빠르게 찾아보는 AI 용어 모음 ·{' '}
              <kbd className="rounded border border-slate-300 px-1 text-xs dark:border-slate-600">/</kbd>{' '}
              검색 포커스
            </p>
          </div>
          <button
            onClick={toggleDark}
            aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="shrink-0 rounded-lg border border-slate-300 px-2.5 py-2 text-lg leading-none hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        <SearchBar ref={inputRef} value={query} onChange={setQuery} />
        <FilterBar
          category={url.category}
          level={url.level}
          counts={COUNTS}
          total={TERMS.length}
          grouped={grouped}
          onChange={(patch) => setUrl(patch)}
          onToggleGroup={() => setGrouped((g) => !g)}
        />

        {showLanding ? (
          <Landing
            terms={TERMS}
            byId={BY_ID}
            roadmaps={ROADMAPS}
            recent={recent}
            bookmarks={bookmarks}
            onOpen={open}
          />
        ) : (
          <>
            <p className="mt-5 text-sm text-slate-500">{ordered.length}개 용어</p>
            {ordered.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {ordered.map((t, i) => (
                  <li key={t.id}>
                    {grouped && (i === 0 || ordered[i - 1].category !== t.category) && (
                      <h2 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400 first:mt-0">
                        {t.category}
                      </h2>
                    )}
                    <TermCard
                      term={t}
                      query={query}
                      selected={i === selected}
                      onOpen={() => open(t.id)}
                      isBookmarked={isBookmarked(t.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-12 text-center">
                <p className="text-slate-600 dark:text-slate-300">찾는 용어가 없나요?</p>
                <a
                  href={ISSUE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-sky-600 underline underline-offset-2 dark:text-sky-400"
                >
                  아래 이슈로 제보해 주세요 →
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {openTerm && (
        <TermDetail
          term={openTerm}
          byId={BY_ID}
          onClose={close}
          onNavigate={open}
          isBookmarked={isBookmarked(openTerm.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  )
}
