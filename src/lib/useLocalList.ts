import { useCallback, useState } from 'react'

// localStorage에 문자열 id 목록을 저장하는 작은 훅.
// 북마크(순서 무관 집합처럼 사용), 최근 본 용어(최신순 목록) 둘 다 이걸로 처리.
function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function write(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // 사생활 보호 모드 등 localStorage 불가 → 조용히 무시(기능만 비활성)
  }
}

export function useLocalList(key: string) {
  const [list, setList] = useState<string[]>(() => read(key))

  const update = useCallback(
    (fn: (prev: string[]) => string[]) => {
      setList((prev) => {
        const next = fn(prev)
        write(key, next)
        return next
      })
    },
    [key],
  )

  const toggle = useCallback(
    (id: string) => update((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])),
    [update],
  )

  // 최근 목록용: 맨 앞으로 올리고 최대 max개 유지
  const pushRecent = useCallback(
    (id: string, max = 8) => update((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, max)),
    [update],
  )

  return { list, toggle, pushRecent, has: (id: string) => list.includes(id) }
}
