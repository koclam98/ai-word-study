// 청킹 로직 셀프체크. 실행: `node src/lib/chunkText.check.ts`
import { chunkText } from './chunkText.ts'
import assert from 'node:assert'

const t = 'abcdefghij' // 길이 10

// size 4, overlap 1 → step 3: [0,4)[3,7)[6,10) — 끝 도달 시 break라 자투리 조각 없음
const c = chunkText(t, 4, 1)
assert.deepEqual(c.map((x) => x.text), ['abcd', 'defg', 'ghij'])

// 겹침 검증: 인접 조각이 실제로 overlap만큼 겹침
assert.equal(c[0].end - c[1].start, 1)

// overlap >= size 방어 (무한루프 안 남)
const c2 = chunkText(t, 3, 5)
assert.ok(c2.length > 0 && c2.length < 20)

// overlap 0 → 겹침 없음
const c3 = chunkText(t, 5, 0)
assert.deepEqual(c3.map((x) => x.text), ['abcde', 'fghij'])

// size 0 → 빈 배열
assert.deepEqual(chunkText(t, 0, 0), [])

console.log('chunkText self-check OK')
