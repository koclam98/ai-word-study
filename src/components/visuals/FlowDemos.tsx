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
