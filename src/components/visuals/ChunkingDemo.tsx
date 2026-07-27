import { useState } from 'react'
import { chunkText } from '../../lib/chunkText'

const SAMPLE =
  '사내 규정에 따르면 연차 휴가는 입사 첫해에 최대 열한 일까지 사용할 수 있으며, 남은 연차는 다음 해로 이월되지 않습니다. 반차는 오전과 오후 중 선택할 수 있습니다.'

// 겹침은 청크 크기의 약 25%로 자동 설정(비개발자에게 슬라이더 하나만 노출).
export function ChunkingDemo() {
  const [size, setSize] = useState(30)
  const overlap = Math.round(size * 0.25)
  const chunks = chunkText(SAMPLE, size, overlap)

  return (
    <div className="text-sm">
      <label className="flex items-center gap-3">
        <span className="whitespace-nowrap text-slate-600 dark:text-slate-300">
          청크 크기: <b>{size}자</b>
        </span>
        <input
          type="range"
          min={12}
          max={80}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full accent-sky-600"
        />
      </label>
      <p className="mt-1 text-xs text-slate-500">
        조각 {chunks.length}개 · 겹침 {overlap}자 (앞 조각과 노란 부분이 겹칩니다)
      </p>

      <div className="mt-3 space-y-2">
        {chunks.map((c, i) => {
          const overlapLen = i === 0 ? 0 : Math.min(overlap, c.text.length)
          const head = c.text.slice(0, overlapLen)
          const rest = c.text.slice(overlapLen)
          return (
            <div
              key={c.start}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 leading-relaxed dark:border-slate-700 dark:bg-slate-800/60"
            >
              <span className="mr-1 select-none text-xs text-slate-400">#{i + 1}</span>
              <mark className="bg-yellow-200 text-inherit dark:bg-yellow-500/40">{head}</mark>
              <span>{rest}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
