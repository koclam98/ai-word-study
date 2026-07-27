import { useState } from 'react'

const QUESTION = '우리 카페 신메뉴 이름 지어줘 (딸기 라떼)'

// 미리 준비된 예시. 값이 낮을수록 안정적·일관, 높을수록 다양·창의적.
const PRESETS: { max: number; label: string; answers: string[] }[] = [
  { max: 0.3, label: '낮음 · 안정적', answers: ['딸기 라떼'] },
  { max: 0.7, label: '중간 · 무난한 변형', answers: ['딸기 크림 라떼', '스트로베리 라떼'] },
  {
    max: 1.01,
    label: '높음 · 창의적',
    answers: ['핑크 베리 클라우드', '딸기밭 한 모금', '스트로베리 몽환 라떼'],
  },
]

function pick(temp: number) {
  return PRESETS.find((p) => temp < p.max) ?? PRESETS[PRESETS.length - 1]
}

export function TemperatureDemo() {
  const [temp, setTemp] = useState(0.2)
  const bucket = pick(temp)

  return (
    <div className="text-sm">
      <p className="text-slate-500">
        질문: <span className="text-slate-700 dark:text-slate-300">{QUESTION}</span>
      </p>
      <label className="mt-3 flex items-center gap-3">
        <span className="whitespace-nowrap text-slate-600 dark:text-slate-300">
          Temperature: <b>{temp.toFixed(1)}</b>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="w-full accent-sky-600"
        />
      </label>
      <p className="mt-1 text-xs text-slate-500">{bucket.label}</p>

      <div className="mt-3 space-y-1.5">
        {bucket.answers.map((a) => (
          <div
            key={a}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60"
          >
            {a}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        낮으면 매번 비슷한 답, 높이면 후보가 다양해지고 예측하기 어려워집니다.
      </p>
    </div>
  )
}
