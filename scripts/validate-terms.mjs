#!/usr/bin/env node
// terms.json 무결성 검증. 문제 있으면 목록 출력 후 exit 1, 없으면 요약 출력 후 exit 0.
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const termsPath = join(root, 'src/data/terms.json')
const visualsDir = join(root, 'src/visuals')
const visualsTsPath = join(root, 'src/lib/visuals.ts')

const REQUIRED_FIELDS = [
  'id',
  'term',
  'termEn',
  'aliases',
  'category',
  'level',
  'oneLiner',
  'description',
  'analogy',
  'example',
  'related',
  'confusedWith',
]
const CATEGORIES = ['데이터', '학습파이프라인', '저장검색', '모델', '실행', '구조', '지식그래프', '문제평가']
const LEVELS = ['기초', '중급', '심화']
const VISUAL_TYPES = ['svg', 'mermaid', 'component']

const errors = []

let raw
try {
  raw = readFileSync(termsPath, 'utf-8')
} catch (e) {
  console.error(`terms.json을 읽을 수 없음: ${e.message}`)
  process.exit(1)
}

let terms
try {
  terms = JSON.parse(raw)
} catch (e) {
  console.error(`terms.json JSON 파싱 실패: ${e.message}`)
  process.exit(1)
}

if (!Array.isArray(terms)) {
  console.error('terms.json은 배열이어야 함')
  process.exit(1)
}

// visuals.ts의 COMPONENTS 객체에서 등록된 키 이름 추출
let registeredComponents = new Set()
if (existsSync(visualsTsPath)) {
  const visualsTs = readFileSync(visualsTsPath, 'utf-8')
  const start = visualsTs.indexOf('COMPONENTS')
  if (start !== -1) {
    const braceStart = visualsTs.indexOf('{', start)
    const braceEnd = visualsTs.indexOf('}', braceStart)
    const body = visualsTs.slice(braceStart + 1, braceEnd)
    for (const m of body.matchAll(/([A-Za-z0-9_]+)\s*,?/g)) {
      registeredComponents.add(m[1])
    }
  }
} else {
  errors.push(`src/lib/visuals.ts 파일이 존재하지 않음: ${visualsTsPath}`)
}

const ids = new Set()
const duplicateIds = new Set()
for (const t of terms) {
  if (t && typeof t.id === 'string') {
    if (ids.has(t.id)) duplicateIds.add(t.id)
    ids.add(t.id)
  }
}

for (const [idx, t] of terms.entries()) {
  const label = t && t.id ? t.id : `index ${idx}`

  for (const field of REQUIRED_FIELDS) {
    if (!(field in t)) {
      errors.push(`[${label}] 필수 필드 누락: ${field}`)
    }
  }

  if (t.id && duplicateIds.has(t.id)) {
    errors.push(`[${label}] id 중복`)
  }

  if (t.category !== undefined && !CATEGORIES.includes(t.category)) {
    errors.push(`[${label}] 허용되지 않는 category: ${t.category}`)
  }

  if (t.level !== undefined && !LEVELS.includes(t.level)) {
    errors.push(`[${label}] 허용되지 않는 level: ${t.level}`)
  }

  if (Array.isArray(t.related)) {
    for (const relId of t.related) {
      if (!ids.has(relId)) {
        errors.push(`[${label}] related에 존재하지 않는 id 참조: ${relId}`)
      }
    }
  }

  if (Array.isArray(t.confusedWith)) {
    for (const cw of t.confusedWith) {
      if (!cw || !ids.has(cw.id)) {
        errors.push(`[${label}] confusedWith에 존재하지 않는 id 참조: ${cw && cw.id}`)
      }
    }
  }

  if (t.visual) {
    const v = t.visual
    if (!VISUAL_TYPES.includes(v.type)) {
      errors.push(`[${label}] 허용되지 않는 visual.type: ${v.type}`)
    } else if (v.type === 'svg') {
      const fileName = v.src ? basename(v.src) : undefined
      if (!fileName || !existsSync(join(visualsDir, fileName))) {
        errors.push(`[${label}] visual.src 파일이 src/visuals/에 존재하지 않음: ${v.src}`)
      }
    } else if (v.type === 'component') {
      if (!v.name || !registeredComponents.has(v.name)) {
        errors.push(`[${label}] visual.name이 COMPONENTS에 등록되지 않음: ${v.name}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`검증 실패: ${errors.length}건의 문제 발견\n`)
  for (const e of errors) console.error(` - ${e}`)
  process.exit(1)
}

console.log(`검증 통과: 용어 ${terms.length}개, 문제 없음`)
process.exit(0)
