import { useEffect, useRef, useState } from 'react'

/**
 * 다크모드: 시스템 설정을 따라가되, 사용자가 수동 토글하면 그 선택을 우선한다.
 * 상태는 메모리에만 둔다(localStorage 미저장) → 새로고침하면 다시 시스템 설정 기준.
 */
export function useDarkMode(): [boolean, () => void] {
  // 초기값은 index.html 인라인 스크립트가 이미 붙여둔 html.dark 여부에서 읽음
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains('dark'),
  )
  const manual = useRef(false)

  // 수동 토글 전까지는 시스템 설정 변화를 실시간 반영
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => {
      if (!manual.current) setDark(mq.matches)
    }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // 상태를 html.dark 클래스에 반영
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggle = () => {
    manual.current = true
    setDark((d) => !d)
  }
  return [dark, toggle]
}
