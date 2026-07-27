// 한글 초성 검색 유틸.
// Fuse.js는 초성 매칭을 못하므로, 초성 전용 인덱스를 따로 만들어 substring 매칭함.

const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
]

const HANGUL_BASE = 0xac00 // '가'
const HANGUL_LAST = 0xd7a3 // '힣'
const CHOSUNG_SET = new Set(CHOSUNG)

/**
 * 문자열에서 한글 음절의 초성만 뽑아 이어붙임.
 * 한글이 아닌 문자(영문/숫자/공백)는 그대로 유지 → 혼합 검색도 자연스럽게 동작.
 * 예: "임베딩 모델" → "ㅇㅂㄷ ㅁㄷ"
 */
export function getChosung(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      out += CHOSUNG[Math.floor((code - HANGUL_BASE) / 588)]
    } else {
      out += ch
    }
  }
  return out
}

/**
 * 쿼리가 초성만으로 이루어졌는지 판단(공백 무시).
 * 하나라도 초성 자모가 있고, 나머지가 초성 자모/공백뿐이면 true.
 * 빈 문자열은 false.
 */
export function isChosungQuery(query: string): boolean {
  const trimmed = query.replace(/\s/g, '')
  if (!trimmed) return false
  let hasChosung = false
  for (const ch of trimmed) {
    if (CHOSUNG_SET.has(ch)) {
      hasChosung = true
    } else {
      return false
    }
  }
  return hasChosung
}
