import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const card =
  'rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'

/** 스트리밍: 답변이 토큰(단어) 단위로 하나씩 찍혀 나온다. */
export function StreamingDemo() {
  const reduced = useReducedMotion()
  const words = ['안녕하세요!', '무엇을', '도와', '드릴까요', '?']
  const [n, setN] = useState(reduced ? words.length : 0)

  useEffect(() => {
    if (reduced) {
      setN(words.length)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i = i >= words.length ? 0 : i + 1 // 다 찍으면 처음부터 반복
      setN(i)
    }, 500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div className="text-sm">
      <p className="text-slate-500">
        질문: <span className="text-slate-700 dark:text-slate-300">인사해 줘</span>
      </p>
      <div className={`mt-3 min-h-[3rem] px-3 py-2 ${card}`}>
        {words.slice(0, n).map((w, i) => (
          <span key={i}>{w} </span>
        ))}
        {!reduced && (
          <span className="inline-block w-[2px] animate-pulse bg-sky-500 align-middle">&nbsp;</span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        답을 다 만든 뒤 한 번에 주지 않고, 만들어지는 대로 조금씩 흘려보냅니다.
      </p>
    </div>
  )
}

/** 토큰: 문장이 AI가 읽는 작은 조각(토큰)들로 잘린다. */
export function TokenizeDemo() {
  const reduced = useReducedMotion()
  const tokens = ['AI', '가', '글', '을', '읽', '는다']
  return (
    <div className="text-sm">
      <style>{`
        .tok-chip { animation: tok-pop 3.6s ease-in-out infinite; }
        @keyframes tok-pop {
          0%, 8%   { opacity: 0.15; transform: translateY(3px); }
          20%, 82% { opacity: 1;    transform: translateY(0); }
          100%     { opacity: 0.15; transform: translateY(3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tok-chip { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      <p className="text-slate-500">문장</p>
      <p className={`mt-1 px-3 py-2 ${card}`}>AI가 글을 읽는다</p>
      <p className="mt-3 text-slate-500">토큰으로 자르면</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`${reduced ? '' : 'tok-chip'} rounded-md border border-sky-300 bg-sky-50 px-2 py-1 text-sky-800 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-200`}
            style={reduced ? undefined : { animationDelay: `${i * 0.25}s` }}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        조각 개수가 곧 글의 길이·요금 계산 단위입니다. (모델마다 자르는 방식이 다름)
      </p>
    </div>
  )
}

/** CoT: 답을 바로 내지 않고 생각의 단계를 차례로 펼친 뒤 결론에 이른다. */
export function CotDemo() {
  const reduced = useReducedMotion()
  const steps = [
    '문제: 사과 3개, 2봉지면 총 몇 개?',
    '① 한 봉지에 3개',
    '② 봉지는 2개',
    '③ 3 × 2 = 6',
    '답: 6개',
  ]
  const [n, setN] = useState(reduced ? steps.length : 1)

  useEffect(() => {
    if (reduced) {
      setN(steps.length)
      return
    }
    let i = 1
    const id = setInterval(() => {
      i = i >= steps.length ? 1 : i + 1
      setN(i)
    }, 900)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div className="text-sm">
      <div className="space-y-1.5">
        {steps.slice(0, n).map((s, i) => (
          <div
            key={i}
            className={`px-3 py-2 ${card} ${i === steps.length - 1 && n === steps.length ? 'border-sky-400 dark:border-sky-600' : ''}`}
          >
            {s}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        중간 풀이 과정을 거치면 곧장 답할 때보다 실수가 줄어듭니다.
      </p>
    </div>
  )
}

/** 양자화: 촘촘한 숫자를 성글게 줄여 모델을 가볍게. 정밀도는 조금 손해. */
export function QuantizationDemo() {
  const reduced = useReducedMotion()
  const [q, setQ] = useState(false) // false=원본, true=양자화

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setQ((v) => !v), 1800)
    return () => clearInterval(id)
  }, [reduced])

  const on = reduced ? true : q
  return (
    <div className="text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-500">원본 (고정밀 · 무거움)</p>
          <div className={`mt-1 px-3 py-2 font-mono ${card}`}>0.7381924</div>
          <div className="mt-2 h-3 w-full rounded bg-sky-500" />
          <p className="mt-1 text-xs text-slate-500">용량 큼</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">양자화 (저정밀 · 가벼움)</p>
          <div className={`mt-1 px-3 py-2 font-mono ${card}`}>
            0.7
            <span className={`text-slate-400 transition-opacity duration-700 ${on ? 'opacity-20' : 'opacity-100'}`}>
              381924
            </span>
          </div>
          <div
            className={`mt-2 h-3 rounded bg-amber-500 transition-all duration-700 ${on ? 'w-1/3' : 'w-full'}`}
          />
          <p className="mt-1 text-xs text-slate-500">용량 작음</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        뒷자리 정밀도를 덜어내 크기·속도를 얻습니다. 답 품질은 조금 떨어질 수 있습니다.
      </p>
    </div>
  )
}

/** 리랭킹: 대충 찾아온 후보를 정밀 재점수해 순서를 다시 매긴다. */
export function RerankingDemo() {
  const reduced = useReducedMotion()
  // 초기 검색 순서 → 재정렬 후 순서(관련도 기준)
  const docs = [
    { id: 'a', label: '환불 규정 안내', score: 0.92 },
    { id: 'b', label: '배송 조회 방법', score: 0.31 },
    { id: 'c', label: '결제 취소 절차', score: 0.85 },
    { id: 'd', label: '회원가입 혜택', score: 0.18 },
  ]
  const initial = ['a', 'b', 'c', 'd']
  const ranked = [...docs].sort((x, y) => y.score - x.score).map((d) => d.id)
  const [order, setOrder] = useState<string[]>(reduced ? ranked : initial)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setOrder((cur) => (cur[0] === ranked[0] ? initial : ranked))
    }, 2200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  const H = 44
  const pos = (id: string) => order.indexOf(id)
  return (
    <div className="text-sm">
      <p className="text-xs text-slate-500">
        {order[0] === ranked[0] ? '재정렬 후 (관련도순)' : '검색 직후 (대략순)'}
      </p>
      <div className="relative mt-2" style={{ height: H * docs.length }}>
        {docs.map((d) => (
          <div
            key={d.id}
            className={`absolute left-0 right-0 flex items-center gap-2 px-3 ${card} transition-transform duration-700`}
            style={{ height: H - 8, transform: `translateY(${pos(d.id) * H}px)` }}
          >
            <span className="w-6 text-center font-mono text-slate-400">{pos(d.id) + 1}</span>
            <span className="flex-1">{d.label}</span>
            <span className="h-2 rounded bg-sky-500" style={{ width: `${d.score * 60}px` }} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        빠른 검색으로 후보를 모은 뒤, 관련도를 다시 재서 위아래 순서를 바로잡습니다.
      </p>
    </div>
  )
}
