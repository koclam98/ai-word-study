import { useReducedMotion } from './useReducedMotion'

// innerHTML로 주입되는 정적 SVG와 달리, React가 정상 DOM에 렌더하므로
// CSS 애니메이션·SMIL이 정상 동작한다. 그래서 흐름 애니는 컴포넌트로 만든다.

/** RAG 파이프라인: 질문→검색→관련 문서→LLM→답변으로 데이터가 흐른다. */
export function RagFlowDemo() {
  const reduced = useReducedMotion()
  const nodes = [
    { x: 6, w: 52, cx: 32, label: '질문', stroke: 'currentColor' },
    { x: 82, w: 52, cx: 108, label: '검색', stroke: 'var(--viz-accent)' },
    { x: 158, w: 60, cx: 188, label: '관련 문서', stroke: 'var(--viz-accent)' },
    { x: 242, w: 44, cx: 264, label: 'LLM', stroke: 'var(--viz-accent-2)' },
    { x: 300, w: 36, cx: 318, label: '답변', stroke: 'currentColor' },
  ]
  const arrows = [
    [59, 80],
    [135, 156],
    [219, 240],
    [287, 298],
  ]
  return (
    <svg
      viewBox="0 0 340 80"
      style={{ width: '100%', height: 'auto' }}
      fontFamily="inherit"
      role="img"
      aria-label="질문에서 검색, 관련 문서, LLM을 거쳐 답변으로 이어지는 5단계 흐름"
    >
      <defs>
        <marker id="ragc-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
        <style>{`
          .ragc-flow { stroke-dasharray: 4 4; animation: ragc-dash 0.6s linear infinite; }
          @keyframes ragc-dash { to { stroke-dashoffset: -8; } }
          .ragc-node { animation: ragc-pulse 4.5s ease-in-out infinite; }
          @keyframes ragc-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          @media (prefers-reduced-motion: reduce) {
            .ragc-flow { stroke-dasharray: none; animation: none; }
            .ragc-node { animation: none; opacity: 1; }
          }
        `}</style>
      </defs>

      <g fontSize="10" textAnchor="middle">
        {nodes.map((n, i) => (
          <g
            key={n.label}
            className={reduced ? undefined : 'ragc-node'}
            style={reduced ? undefined : { animationDelay: `${i * 0.5}s` }}
          >
            <rect x={n.x} y={28} width={n.w} height={24} rx={5} fill="none" stroke={n.stroke} strokeWidth="1" />
            <text x={n.cx} y={43} fill="currentColor">
              {n.label}
            </text>
          </g>
        ))}
      </g>

      <g className={reduced ? undefined : 'ragc-flow'} stroke="var(--viz-muted)" strokeWidth="1" markerEnd="url(#ragc-arrow)">
        {arrows.map(([x1, x2], i) => (
          <line key={i} x1={x1} y1={40} x2={x2} y2={40} />
        ))}
      </g>

      {/* 흐르는 데이터 조각 (SMIL). reduced면 렌더 안 함. */}
      {!reduced && (
        <circle cx={32} cy={40} r={3.5} fill="var(--viz-accent)">
          <animate attributeName="cx" values="32;318" dur="4.5s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.07;0.93;1"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  )
}

/** 컨텍스트 윈도우: 내용이 아래→위로 차오르다 한도를 넘으면 위로 흘러넘친다. */
export function ContextWindowDemo() {
  const reduced = useReducedMotion()
  const fillY = [150, 130, 110, 90, 70, 50] // 아래부터 채워지는 순서
  const overflow = [
    { x: 96, y: 14 },
    { x: 122, y: 8 },
    { x: 148, y: 16 },
  ]
  return (
    <svg
      viewBox="0 0 240 190"
      style={{ width: '100%', height: 'auto' }}
      fontFamily="inherit"
      role="img"
      aria-label="정해진 크기의 상자에 내용이 차오르고, 한도를 넘은 내용이 위로 흘러넘치는 그림"
    >
      <defs>
        <style>{`
          .ctxc-bar { animation: ctxc-rise 4.8s ease-in-out infinite; }
          @keyframes ctxc-rise { 0% { opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; } }
          .ctxc-of { animation: ctxc-blink 4.8s ease-in-out infinite; }
          @keyframes ctxc-blink { 0%,55% { opacity: 0; } 63% { opacity: 0.9; } 75% { opacity: 0.25; } 87% { opacity: 0.9; } 100% { opacity: 0; } }
          @media (prefers-reduced-motion: reduce) {
            .ctxc-bar { animation: none; opacity: 1; }
            .ctxc-of { animation: none; opacity: 0.9; }
          }
        `}</style>
      </defs>

      {/* 넘친 내용 (상자 위로) */}
      <g fill="var(--viz-accent-2)">
        {overflow.map((o, i) => (
          <rect
            key={i}
            className={reduced ? undefined : 'ctxc-of'}
            style={reduced ? { opacity: 0.9 } : { animationDelay: `${i * 0.15}s` }}
            x={o.x}
            y={o.y}
            width={20}
            height={10}
            rx={2}
          />
        ))}
      </g>
      <text x={176} y={20} fontSize="9" fill="var(--viz-muted)">
        넘침(잊힘)
      </text>

      {/* 상자 (컨텍스트 윈도우) */}
      <rect x={70} y={34} width={100} height={140} rx={4} fill="none" stroke="currentColor" strokeWidth="1" />

      {/* 채워진 내용: 아래에서 위로 차례로 */}
      <g fill="var(--viz-accent)">
        {fillY.map((y, i) => (
          <rect
            key={y}
            className={reduced ? undefined : 'ctxc-bar'}
            style={reduced ? undefined : { animationDelay: `${i * 0.28}s` }}
            x={80}
            y={y}
            width={80}
            height={14}
            rx={2}
          />
        ))}
      </g>
      <text x={120} y={188} textAnchor="middle" fontSize="9" fill="var(--viz-muted)">
        정해진 한도
      </text>
    </svg>
  )
}

/** 데이터 파이프라인: 지저분한 원본이 수집→정제→가공→저장을 타고 흘러 깔끔한 학습 데이터로 나온다. */
export function PipelineFlowDemo() {
  const reduced = useReducedMotion()
  const stages = [
    { x: 40, cx: 66, label: '수집', stroke: 'currentColor' },
    { x: 112, cx: 138, label: '정제', stroke: 'currentColor' },
    { x: 184, cx: 210, label: '가공', stroke: 'currentColor' },
    { x: 256, cx: 282, label: '저장', stroke: 'var(--viz-accent)' },
  ]
  const arrows = [
    [26, 38],
    [93, 110],
    [165, 182],
    [237, 254],
  ]
  return (
    <svg
      viewBox="0 0 340 96"
      style={{ width: '100%', height: 'auto' }}
      fontFamily="inherit"
      role="img"
      aria-label="지저분한 원본 데이터가 수집, 정제, 가공, 저장 단계를 차례로 거쳐 깔끔한 학습 데이터로 흘러 나오는 그림"
    >
      <defs>
        <marker id="dpc-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
        <style>{`
          .dpc-flow { stroke-dasharray: 4 4; animation: dpc-dash 0.6s linear infinite; }
          @keyframes dpc-dash { to { stroke-dashoffset: -8; } }
          @media (prefers-reduced-motion: reduce) {
            .dpc-flow { stroke-dasharray: none; animation: none; }
          }
        `}</style>
      </defs>

      {/* 지저분한 원본 */}
      <path d="M8 44 l10 -6 l6 10 l-9 8 z" fill="var(--viz-accent-2)" />
      <text x={16} y={72} textAnchor="middle" fontSize="8" fill="var(--viz-muted)">
        원본
      </text>

      <g fontSize="10" textAnchor="middle">
        {stages.map((s) => (
          <g key={s.label}>
            <rect x={s.x} y={34} width={52} height={24} rx={5} fill="none" stroke={s.stroke} strokeWidth="1" />
            <text x={s.cx} y={49} fill="currentColor">
              {s.label}
            </text>
          </g>
        ))}
      </g>

      <g className={reduced ? undefined : 'dpc-flow'} stroke="var(--viz-muted)" strokeWidth="1" markerEnd="url(#dpc-arrow)">
        {arrows.map(([x1, x2], i) => (
          <line key={i} x1={x1} y1={46} x2={x2} y2={46} />
        ))}
      </g>

      {/* 깔끔한 결과 */}
      <rect x={318} y={40} width={12} height={12} rx={2} fill="var(--viz-accent)" />
      <text x={324} y={72} textAnchor="middle" fontSize="8" fill="var(--viz-muted)">
        학습용
      </text>

      {/* 흐르는 데이터 조각 (SMIL). reduced면 렌더 안 함. */}
      {!reduced && (
        <circle cy={46} r={3.5} fill="var(--viz-accent)">
          <animate attributeName="cx" values="16;324" dur="4s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.06;0.94;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  )
}

/** 샤딩: 큰 데이터가 조각으로 나뉘어 여러 장비로 분산 저장된다(조각이 각 장비로 흐름). */
export function ShardingDemo() {
  const reduced = useReducedMotion()
  // 장비 박스 x, 샤드 슬롯 x, 박스 중심(흐르는 점 도착 x)
  const machines = [
    { x: 24, slotX: 36, cx: 58, label: '장비 1 · 샤드 A' },
    { x: 126, slotX: 138, cx: 160, label: '장비 2 · 샤드 B' },
    { x: 228, slotX: 240, cx: 262, label: '장비 3 · 샤드 C' },
  ]
  return (
    <svg
      viewBox="0 0 320 180"
      style={{ width: '100%', height: 'auto' }}
      fontFamily="inherit"
      role="img"
      aria-label="하나의 큰 데이터가 세 조각으로 나뉘어 세 대의 장비에 분산 저장되는 그림"
    >
      {/* 큰 데이터 */}
      <rect x={118} y={12} width={84} height={30} rx={4} fill="none" stroke="currentColor" strokeWidth="1" />
      <text x={160} y={31} textAnchor="middle" fontSize="11" fill="currentColor">
        거대한 데이터
      </text>

      {/* 장비 + 저장된 샤드(항상 표시 = 정적 기준 상태) */}
      <g fontSize="9" textAnchor="middle">
        {machines.map((m) => (
          <g key={m.label}>
            <rect x={m.x} y={100} width={68} height={56} rx={5} fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x={m.slotX} y={112} width={44} height={16} rx={2} fill="var(--viz-accent)" />
            <text x={m.cx} y={148} fill="var(--viz-muted)">
              {m.label}
            </text>
          </g>
        ))}
      </g>

      {/* 큰 데이터 → 각 장비로 흐르는 조각 (SMIL). reduced면 렌더 안 함. */}
      {!reduced &&
        machines.map((m, i) => (
          <circle key={m.label} r={4} fill="var(--viz-accent-2)">
            <animate attributeName="cx" values={`160;${m.cx}`} dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values="42;120" dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.7;1"
              dur="2.4s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      <text x={160} y={172} textAnchor="middle" fontSize="9" fill="var(--viz-muted)">
        나눠서 동시에 처리 → 빠름
      </text>
    </svg>
  )
}
