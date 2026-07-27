import type { ReactNode } from 'react'
import { isChosungQuery } from './chosung'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * text 안에서 query와 일치하는 부분을 <mark>로 감쌈 (대소문자 무시).
 * 초성 쿼리(ㅇㅂㄷ 등)는 원문에 그대로 없으므로 하이라이트 생략하고 원문 반환.
 */
export function highlight(text: string, query: string): ReactNode {
  const q = query.trim()
  if (!q || isChosungQuery(q)) return text

  // 캡처그룹 split → 매칭 조각이 배열에 그대로 남음. 조각을 q와 비교해 <mark> 처리.
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'ig'))
  const lower = q.toLowerCase()
  return parts.map((part, i) =>
    part.toLowerCase() === lower ? (
      <mark
        key={i}
        className="rounded bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-500/40"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
