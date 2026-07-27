import { useEffect, useState } from 'react'

/**
 * prefers-reduced-motion 추적. 켜져 있으면 컴포넌트가 움직임을 끈다(접근성).
 *
 * 애니 시각자료는 반드시 이런 React 컴포넌트로 만든다.
 * innerHTML(dangerouslySetInnerHTML)로 주입된 정적 SVG는 CSS·SMIL
 * 애니 타임라인이 시작되지 않고 얼어붙기 때문이다.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return reduced
}
