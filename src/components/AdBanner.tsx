import { useEffect } from 'react'

// SLOT: AdSense → 광고 → 광고 단위 기준 → 디스플레이 광고 생성 시 나오는 data-ad-slot 숫자로 교체
const CLIENT = 'ca-pub-9103352043785115'
const SLOT = 'XXXXXXXXXX'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdBanner() {
  useEffect(() => {
    // 스크립트 로드 전이면 배열이 없을 수 있어 방어
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // 광고 로드 실패는 앱 동작에 영향 없음 — 무시
    }
  }, [])

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={CLIENT}
      data-ad-slot={SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
