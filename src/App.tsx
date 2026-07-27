import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import termsData from './data/terms.json'
import type { Term } from './types'
import { createSearcher } from './lib/search'
import { useUrlState } from './lib/url'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { TermCard } from './components/TermCard'
import { TermDetail } from './components/TermDetail'

const TERMS = termsData as Term[]
const BY_ID = new Map(TERMS.map((t) => [t.id, t]))
const ISSUE_URL = 'https://github.com/koclam98/ai-word-study/issues/new'

export default function App() {
  const searcher = useMemo(() => createSearcher(TERMS), [])
  const [query, setQuery] = useState('')
  const [url, setUrl] = useUrlState()
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // 검색 → 필터 순으로 결과 산출
  const results = useMemo(() => {
    let list = searcher(query)
    if (url.category) list = list.filter((t) => t.category === url.category)
    if (url.level) list = list.filter((t) => t.level === url.level)
    return list
  }, [searcher, query, url.category, url.level])

  const openTerm = BY_ID.get(url.termId ?? '') ?? null

  const open = useCallback((id: string) => setUrl({ termId: id }), [setUrl])
  const close = useCallback(() => setUrl({ termId: null }), [setUrl])

  // 결과가 바뀌면 선택 인덱스 리셋
  useEffect(() => {
    setSelected(0)
  }, [results])

  // 진입 시 자동 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 전역 키보드 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 상세 열려 있으면 Esc로 닫기 최우선
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
      // 상세 열려 있을 땐 목록 네비게이션 비활성
      if (url.termId) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selected]) {
        e.preventDefault()
        open(results[selected].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [results, selected, url.termId, open, close])

  // 선택된 카드가 보이도록 스크롤
  useEffect(() => {
    document
      .querySelector<HTMLElement>('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">AI 용어 사전</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            사내 누구나 빠르게 찾아보는 AI 용어 모음 ·{' '}
            <kbd className="rounded border border-slate-300 px-1 text-xs dark:border-slate-600">/</kbd>{' '}
            검색 포커스
          </p>
        </header>

        <SearchBar ref={inputRef} value={query} onChange={setQuery} />
        <FilterBar
          category={url.category}
          level={url.level}
          onChange={(patch) => setUrl(patch)}
        />

        <p className="mt-5 text-sm text-slate-500">{results.length}개 용어</p>

        {results.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {results.map((t, i) => (
              <li key={t.id}>
                <TermCard
                  term={t}
                  query={query}
                  selected={i === selected}
                  onOpen={() => open(t.id)}
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
      </div>

      {openTerm && (
        <TermDetail term={openTerm} byId={BY_ID} onClose={close} onNavigate={open} />
      )}
    </div>
  )
}
