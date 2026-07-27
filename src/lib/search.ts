import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Term } from '../types'
import { getChosung, isChosungQuery } from './chosung'

// 각 용어에 초성 인덱스를 미리 붙여 둠(검색 대상: 한글명 + 별칭).
export interface IndexedTerm extends Term {
  _chosung: string
}

export function buildIndex(terms: Term[]): IndexedTerm[] {
  return terms.map((t) => ({
    ...t,
    _chosung: getChosung([t.term, ...t.aliases].join(' ')),
  }))
}

const FUSE_OPTIONS: IFuseOptions<IndexedTerm> = {
  includeScore: true,
  threshold: 0.35, // 오타 허용
  ignoreLocation: true,
  keys: [
    { name: 'term', weight: 3 },
    { name: 'termEn', weight: 2 },
    { name: 'aliases', weight: 2 },
    { name: 'oneLiner', weight: 1 },
    { name: 'description', weight: 0.5 },
  ],
}

export function createSearcher(terms: Term[]) {
  const indexed = buildIndex(terms)
  const fuse = new Fuse(indexed, FUSE_OPTIONS)

  return function search(query: string): IndexedTerm[] {
    const q = query.trim()
    if (!q) return indexed

    // 초성 쿼리는 Fuse가 처리 못하므로 초성 인덱스에서 직접 매칭
    if (isChosungQuery(q)) {
      const needle = q.replace(/\s/g, '')
      return indexed.filter((t) => t._chosung.replace(/\s/g, '').includes(needle))
    }

    return fuse.search(q).map((r) => r.item)
  }
}
