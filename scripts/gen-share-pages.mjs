// 빌드 후 실행: 용어별 공유 스텁 페이지(dist/t/<id>.html)를 만든다.
// 슬랙 등이 이 페이지의 OG 메타로 미리보기 카드를 그리고, 사람이 열면
// 즉시 앱 해시 딥링크(../#/term/<id>)로 이동한다. 백엔드 불필요.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const terms = JSON.parse(readFileSync(resolve(root, 'src/data/terms.json'), 'utf8'))
const outDir = resolve(root, 'dist/t')
mkdirSync(outDir, { recursive: true })

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

for (const t of terms) {
  const target = `../#/term/${encodeURIComponent(t.id)}`
  const title = `${t.term}${t.termEn && t.termEn !== t.term ? ` (${t.termEn})` : ''} — AI 용어 사전`
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(t.oneLiner)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(t.oneLiner)}">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="${esc(target)}">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body style="font-family:sans-serif;padding:2rem">
이동 중… 안 넘어가면 <a href="${esc(target)}">여기를 누르세요</a>.
</body>
</html>
`
  writeFileSync(resolve(outDir, `${t.id}.html`), html)
}

console.log(`공유 페이지 ${terms.length}개 생성: dist/t/`)
