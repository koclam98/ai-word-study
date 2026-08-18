// 빌드 후 실행. 두 가지를 한다.
// 1) dist/index.html 의 #root 안에 전체 용어를 정적 HTML로 주입한다.
//    SPA는 크롤러에게 빈 <div id="root"></div> 로만 보여서 AdSense가
//    "콘텐츠 없는 화면에 광고" 위반을 잡는다. createRoot().render()가
//    마운트 시 #root 자식을 교체하므로, 실제 사용자는 그대로 앱을 보고
//    크롤러만 이 정적 콘텐츠를 본다(숨김이 아니라 동일 콘텐츠).
// 2) 용어별 페이지 dist/t/<id>.html 를 실제 콘텐츠 페이지로 만든다.
//    (예전엔 즉시 딥링크로 튕기는 리다이렉트 stub이라 그 자체가 저품질 화면)
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const terms = JSON.parse(readFileSync(resolve(root, 'src/data/terms.json'), 'utf8'))

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// 용어 하나를 본문 HTML(article)로. 상세/목록 양쪽에서 재사용.
const termArticle = (t) => {
  const heading = `${t.term}${t.termEn && t.termEn !== t.term ? ` (${t.termEn})` : ''}`
  const rows = [
    `<p><strong>${esc(t.oneLiner)}</strong></p>`,
    t.description && `<p>${esc(t.description)}</p>`,
    t.analogy && `<p>비유: ${esc(t.analogy)}</p>`,
    t.example && `<p>예시: ${esc(t.example)}</p>`,
    Array.isArray(t.confusedWith) &&
      t.confusedWith.length &&
      `<p>혼동 주의: ${t.confusedWith.map((c) => esc(c.note)).join(' / ')}</p>`,
  ].filter(Boolean)
  return `<article><h2>${esc(heading)}</h2><p>분류: ${esc(t.category)} · 난이도: ${esc(
    t.level,
  )}</p>${rows.join('')}</article>`
}

// --- 1) 메인 페이지 프리렌더 주입 ---
const indexPath = resolve(root, 'dist/index.html')
let indexHtml = readFileSync(indexPath, 'utf8')

const intro = `<h1>AI 용어 사전</h1><p>사내 비개발자·주니어를 위한 AI 용어 모음. 총 ${terms.length}개 용어를 검색·필터로 찾아볼 수 있습니다.</p>`
const list = terms.map(termArticle).join('\n')
const prerender = `<div style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">${intro}\n${list}</div>`

if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html 에서 빈 #root 를 찾지 못함 — 주입 위치 확인 필요')
}
indexHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${prerender}</div>`)
writeFileSync(indexPath, indexHtml)

// --- 2) 용어별 콘텐츠 페이지 ---
const outDir = resolve(root, 'dist/t')
mkdirSync(outDir, { recursive: true })

for (const t of terms) {
  const target = `../#/term/${encodeURIComponent(t.id)}`
  const title = `${t.term}${t.termEn && t.termEn !== t.term ? ` (${t.termEn})` : ''} — AI 용어 사전`
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(t.oneLiner)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(t.oneLiner)}">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="${esc(target)}">
</head>
<body style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">
${termArticle(t)}
<p><a href="${esc(target)}">→ AI 용어 사전에서 인터랙티브하게 보기</a></p>
</body>
</html>
`
  writeFileSync(resolve(outDir, `${t.id}.html`), html)
}

console.log(`프리렌더 주입 완료 + 용어 페이지 ${terms.length}개 생성`)
