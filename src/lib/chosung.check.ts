// 초성 유틸 셀프체크. 실행: `node src/lib/chosung.check.ts`
import { getChosung, isChosungQuery } from './chosung.ts'
import assert from 'node:assert'

assert.equal(getChosung('임베딩'), 'ㅇㅂㄷ')
assert.equal(getChosung('임베딩 모델'), 'ㅇㅂㄷ ㅁㄷ')
assert.equal(getChosung('RAG 검색'), 'RAG ㄱㅅ') // 영문 보존
assert.equal(getChosung('코사인'), 'ㅋㅅㅇ')

assert.equal(isChosungQuery('ㅇㅂㄷ'), true)
assert.equal(isChosungQuery('ㅇ ㅂㄷ'), true) // 공백 무시
assert.equal(isChosungQuery('임베딩'), false) // 완성형은 초성쿼리 아님
assert.equal(isChosungQuery('rag'), false)
assert.equal(isChosungQuery(''), false)

// 초성 쿼리로 임베딩 매칭되는지
assert.ok(getChosung('임베딩').includes('ㅇㅂㄷ'))

console.log('chosung self-check OK')
