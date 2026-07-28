// 용어별 공유 페이지 URL. 슬랙 등에 붙이면 미리보기 카드(OG 메타)가 뜬다.
// 공유 페이지(dist/t/<id>.html)는 빌드 시 scripts/gen-share-pages.mjs 가 생성하며,
// 열리면 앱의 해시 딥링크(#/term/<id>)로 즉시 이동한다.
export function shareUrl(id: string): string {
  const appRoot = location.href.split('#')[0] // 앱 index 기준(쿼리/해시 제거는 URL 해석이 처리)
  return new URL(`t/${encodeURIComponent(id)}.html`, appRoot).href
}
