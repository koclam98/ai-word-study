import { useEffect, useState, useCallback } from 'react'
import type { Category, Level } from '../types'

export interface UrlState {
  category: Category | null
  level: Level | null
  termId: string | null // 열려 있는 상세 용어 (해시 #/term/:id)
}

function parseUrl(): UrlState {
  const params = new URLSearchParams(window.location.search)
  const hash = window.location.hash // 예: #/term/embedding
  const m = hash.match(/^#\/term\/(.+)$/)
  return {
    category: (params.get('category') as Category) || null,
    level: (params.get('level') as Level) || null,
    termId: m ? decodeURIComponent(m[1]) : null,
  }
}

function buildUrl(s: UrlState): string {
  const params = new URLSearchParams()
  if (s.category) params.set('category', s.category)
  if (s.level) params.set('level', s.level)
  const search = params.toString()
  const hash = s.termId ? `#/term/${encodeURIComponent(s.termId)}` : ''
  return `${window.location.pathname}${search ? '?' + search : ''}${hash}`
}

/**
 * URL(쿼리스트링+해시) ↔ 앱 상태 동기화 훅.
 * 뒤로가기/새로고침/딥링크 공유가 전부 URL로 복원됨.
 */
export function useUrlState(): [UrlState, (patch: Partial<UrlState>) => void] {
  const [state, setState] = useState<UrlState>(parseUrl)

  // 뒤로/앞으로 가기 대응
  useEffect(() => {
    const onPop = () => setState(parseUrl())
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  const update = useCallback((patch: Partial<UrlState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      const url = buildUrl(next)
      window.history.pushState(null, '', url)
      return next
    })
  }, [])

  return [state, update]
}
