import { useState } from 'react'
import type { Term } from '../types'
import { CATEGORY_STYLE } from '../lib/categoryColors'
import { VisualBlock } from './VisualBlock'
import { CompareView } from './CompareView'
import { shareUrl } from '../lib/share'

interface Props {
  term: Term
  byId: Map<string, Term>
  onClose: () => void
  onNavigate: (id: string) => void
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function TermDetail({ term, byId, onClose, onNavigate, isBookmarked, onToggleBookmark }: Props) {
  const [copied, setCopied] = useState(false)
  // 헷갈리는 개념 비교로 열 상대 용어 id
  const [compareId, setCompareId] = useState<string | null>(null)
  const compareTerm = compareId ? byId.get(compareId) : null
  const compareNote =
    (compareId && term.confusedWith.find((c) => c.id === compareId)?.note) || ''

  const copyLink = async () => {
    // 슬랙 등에서 미리보기 카드가 뜨도록 용어별 공유 페이지(OG 메타 포함) 링크를 복사
    const url = shareUrl(term.id)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard 권한 없거나 http 컨텍스트 → 조용히 무시(사용자가 URL 직접 복사 가능)
    }
  }

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* drawer: 데스크톱 우측 패널, 모바일 전체폭 */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${term.term} 상세`}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[term.category]}`}>
                {term.category}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {term.level}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{term.term}</h2>
            <p className="text-slate-400">{term.termEn}</p>
            {term.aliases.length > 0 && (
              <p className="mt-1 text-sm text-slate-400">별칭: {term.aliases.join(', ')}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => onToggleBookmark(term.id)}
              aria-label={isBookmarked ? '북마크 해제' : '북마크'}
              title={isBookmarked ? '북마크 해제' : '북마크'}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={copyLink}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {copied ? '복사됨 ✓' : '링크 복사'}
            </button>
            <button
              onClick={onClose}
              aria-label="닫기"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <Section label="한줄 요약">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{term.oneLiner}</p>
          </Section>

          {term.visual && (
            <Section label="그림으로 보기">
              <VisualBlock visual={term.visual} />
            </Section>
          )}

          <Section label="설명">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{term.description}</p>
          </Section>

          {term.analogy && (
            <Section label="비유">
              <p className="rounded-lg bg-slate-50 p-3 leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                💡 {term.analogy}
              </p>
            </Section>
          )}

          {term.example && (
            <Section label="실무 예시">
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">{term.example}</p>
            </Section>
          )}

          {term.confusedWith.length > 0 && (
            <Section label="헷갈리는 개념">
              <ul className="space-y-2">
                {term.confusedWith.map((c) => {
                  const other = byId.get(c.id)
                  return (
                    <li key={c.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate(c.id)}
                          disabled={!other}
                          className="font-medium text-slate-800 underline-offset-2 hover:underline disabled:no-underline dark:text-slate-100"
                        >
                          {other ? other.term : c.id}
                        </button>
                        {other && (
                          <button
                            onClick={() => setCompareId(c.id)}
                            className="ml-auto shrink-0 rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          >
                            ⇄ 비교
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{c.note}</p>
                    </li>
                  )
                })}
              </ul>
            </Section>
          )}

          {term.related.length > 0 && (
            <Section label="관련 용어">
              <div className="flex flex-wrap gap-2">
                {term.related.map((id) => {
                  const other = byId.get(id)
                  return (
                    <button
                      key={id}
                      onClick={() => onNavigate(id)}
                      disabled={!other}
                      className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {other ? other.term : id}
                    </button>
                  )
                })}
              </div>
            </Section>
          )}
        </div>
      </aside>

      {compareTerm && (
        <CompareView
          a={term}
          b={compareTerm}
          note={compareNote}
          onClose={() => setCompareId(null)}
        />
      )}
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h3>
      {children}
    </section>
  )
}
