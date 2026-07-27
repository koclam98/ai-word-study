import { useReducedMotion } from './useReducedMotion'

// SVG 다이어그램 애니. 정상 React DOM이므로 CSS·SMIL 모두 동작.
// 이동(기하 속성)은 SMIL, 밝기(opacity)·점선흐름은 CSS로 처리한다.

const svgBox = { width: '100%', height: 'auto' } as const

/** 에이전트: 생각→행동(도구)→관찰을 스스로 반복하며 목표에 다가간다. */
export function AgentLoopDemo() {
  const reduced = useReducedMotion()
  const nodes = [
    { cx: 120, cy: 30, label: '생각', color: 'var(--viz-accent)' },
    { cx: 165, cy: 108, label: '행동(도구)', color: 'var(--viz-accent-2)' },
    { cx: 75, cy: 108, label: '관찰', color: 'var(--viz-accent)' },
  ]
  return (
    <svg viewBox="0 0 240 150" style={svgBox} fontFamily="inherit" role="img" aria-label="생각, 행동, 관찰을 반복하는 순환 흐름">
      <style>{`
        .agl-node { animation: agl-pulse 3s ease-in-out infinite; }
        @keyframes agl-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .agl-node { animation: none; opacity: 1; } }
      `}</style>
      <defs>
        <marker id="agl-ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
      </defs>
      {/* 순환 경로(방향 표시) */}
      <path d="M120,32 A52,52 0 1 1 119.9,32" fill="none" stroke="var(--viz-muted)" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#agl-ar)" />
      <text x="120" y="86" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">반복</text>
      {nodes.map((n, i) => (
        <g key={n.label} className={reduced ? undefined : 'agl-node'} style={reduced ? undefined : { animationDelay: `${i}s` }}>
          <circle cx={n.cx} cy={n.cy} r="17" fill="none" stroke={n.color} strokeWidth="1.2" />
          <text x={n.cx} y={n.cy + 3} textAnchor="middle" fontSize="9" fill="currentColor">{n.label}</text>
        </g>
      ))}
      {/* 경로를 도는 데이터 조각 */}
      {!reduced && (
        <circle r="3.5" fill="var(--viz-accent-2)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M120,32 A52,52 0 1 1 119.9,32" />
        </circle>
      )}
    </svg>
  )
}

/** 어텐션: 지금 보는 단어가 문장 속 어떤 단어에 더 집중하는지(굵을수록 강함). */
export function AttentionDemo() {
  const reduced = useReducedMotion()
  const words = [
    { x: 40, label: '그' },
    { x: 110, label: '사과' },
    { x: 175, label: '는' },
    { x: 250, label: '빨갛다', focus: true },
  ]
  // focus 단어(빨갛다)가 다른 단어에 두는 주의 강도
  const links = [
    { to: 40, w: 0.35, delay: 0.6 },
    { to: 110, w: 1, delay: 0 },
    { to: 175, w: 0.3, delay: 0.9 },
  ]
  const fx = 250
  return (
    <svg viewBox="0 0 300 100" style={svgBox} fontFamily="inherit" role="img" aria-label="'빨갛다'가 '사과'에 가장 강하게 주의를 두는 모습">
      <style>{`
        .att-link { animation: att-glow 2.4s ease-in-out infinite; }
        @keyframes att-glow { 0%,100% { opacity: 0.15; } 50% { opacity: var(--att-w); } }
        @media (prefers-reduced-motion: reduce) { .att-link { animation: none; opacity: var(--att-w); } }
      `}</style>
      {links.map((l, i) => (
        <path
          key={i}
          className={reduced ? undefined : 'att-link'}
          d={`M${fx},58 Q${(fx + l.to) / 2},${18} ${l.to},58`}
          fill="none"
          stroke="var(--viz-accent)"
          strokeWidth={0.5 + l.w * 2.5}
          style={{ ['--att-w' as string]: l.w, animationDelay: `${l.delay}s`, opacity: reduced ? l.w : undefined }}
        />
      ))}
      {words.map((w) => (
        <text key={w.label} x={w.x} y={72} textAnchor="middle" fontSize="13" fill="currentColor" fontWeight={w.focus ? 700 : 400}>
          {w.label}
        </text>
      ))}
      <text x="150" y="94" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">‘빨갛다’ → ‘사과’ 에 가장 강하게 집중</text>
    </svg>
  )
}

/** 하이브리드 검색: 키워드 검색과 벡터(의미) 검색 결과를 하나로 합친다. */
export function HybridSearchDemo() {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 300 130" style={svgBox} fontFamily="inherit" role="img" aria-label="키워드 검색과 벡터 검색이 하나의 결과로 합쳐지는 흐름">
      <style>{`
        .hyb-flow { stroke-dasharray: 4 4; animation: hyb-dash 0.6s linear infinite; }
        @keyframes hyb-dash { to { stroke-dashoffset: -8; } }
        @media (prefers-reduced-motion: reduce) { .hyb-flow { stroke-dasharray: none; animation: none; } }
      `}</style>
      <defs>
        <marker id="hyb-ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
      </defs>
      <g fontSize="10" textAnchor="middle">
        <rect x="8" y="16" width="86" height="26" rx="5" fill="none" stroke="var(--viz-accent)" strokeWidth="1" />
        <text x="51" y="32" fill="currentColor">키워드 검색</text>
        <rect x="8" y="88" width="86" height="26" rx="5" fill="none" stroke="var(--viz-accent-2)" strokeWidth="1" />
        <text x="51" y="104" fill="currentColor">벡터 검색</text>
        <rect x="196" y="52" width="96" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="244" y="68" fill="currentColor">결합 결과</text>
      </g>
      <g className={reduced ? undefined : 'hyb-flow'} stroke="var(--viz-muted)" strokeWidth="1" fill="none" markerEnd="url(#hyb-ar)">
        <path d="M96,29 C150,29 150,63 194,63" />
        <path d="M96,101 C150,101 150,67 194,67" />
      </g>
      {!reduced && (
        <>
          <circle r="3" fill="var(--viz-accent)"><animateMotion dur="2s" repeatCount="indefinite" path="M96,29 C150,29 150,63 194,63" /></circle>
          <circle r="3" fill="var(--viz-accent-2)"><animateMotion dur="2s" begin="0.4s" repeatCount="indefinite" path="M96,101 C150,101 150,67 194,67" /></circle>
        </>
      )}
    </svg>
  )
}

/** ANN 검색: 모든 점을 다 비교하지 않고, 이웃을 점프하며 목표 근처로 빠르게 간다. */
export function AnnSearchDemo() {
  const reduced = useReducedMotion()
  const dots = [
    [30, 120], [70, 60], [120, 110], [160, 40], [210, 90], [255, 50],
  ]
  // 점프 경로(시작→…→목표)
  const path = 'M30,120 L70,60 L120,110 L160,40 L255,50'
  return (
    <svg viewBox="0 0 290 150" style={svgBox} fontFamily="inherit" role="img" aria-label="이웃 점을 점프하며 목표 근처로 다가가는 근사 최근접 탐색">
      <style>{`
        .ann-seg { stroke-dasharray: 200; stroke-dashoffset: 200; animation: ann-draw 3.5s ease-in-out infinite; }
        @keyframes ann-draw { 0% { stroke-dashoffset: 200; } 60%,100% { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .ann-seg { animation: none; stroke-dashoffset: 0; } }
      `}</style>
      {/* 전체 점들(후보) */}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--viz-muted)" />
      ))}
      {/* 점프 경로 */}
      <path className={reduced ? undefined : 'ann-seg'} d={path} fill="none" stroke="var(--viz-accent)" strokeWidth="1.5" />
      {/* 시작/목표 강조 */}
      <circle cx="30" cy="120" r="5" fill="none" stroke="var(--viz-accent)" strokeWidth="1.5" />
      <text x="30" y="140" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">시작</text>
      <circle cx="255" cy="50" r="6" fill="none" stroke="var(--viz-accent-2)" strokeWidth="1.5" />
      <text x="255" y="34" textAnchor="middle" fontSize="9" fill="var(--viz-accent-2)">목표</text>
      {/* 점프하는 탐색 지점 */}
      {!reduced && (
        <circle r="4" fill="var(--viz-accent)">
          <animateMotion dur="3.5s" repeatCount="indefinite" keyPoints="0;0;0.25;0.25;0.5;0.5;0.75;0.75;1;1" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;1" calcMode="linear" path={path} />
        </circle>
      )}
      <text x="145" y="146" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">이웃만 골라 점프 → 전수 비교보다 빠름</text>
    </svg>
  )
}

/** 코사인 유사도: 두 벡터의 '각도'가 좁을수록 의미가 비슷하다. */
export function CosineSimDemo() {
  const reduced = useReducedMotion()
  const O = { x: 30, y: 130 }
  return (
    <svg viewBox="0 0 220 150" style={svgBox} fontFamily="inherit" role="img" aria-label="두 벡터의 각도가 좁아지면 유사도가 높아지는 모습">
      <defs>
        <marker id="cos-ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" strokeWidth="1" />
        </marker>
      </defs>
      {/* 벡터 A (고정) */}
      <line x1={O.x} y1={O.y} x2="170" y2="35" stroke="var(--viz-accent)" strokeWidth="1.5" markerEnd="url(#cos-ar)" />
      <text x="176" y="34" fontSize="10" fill="var(--viz-accent)">A</text>
      {/* 벡터 B (각도 흔들림) */}
      <g>
        {!reduced && (
          <animateTransform attributeName="transform" attributeType="XML" type="rotate"
            values={`0 ${O.x} ${O.y}; 42 ${O.x} ${O.y}; 0 ${O.x} ${O.y}`} dur="4s" repeatCount="indefinite" />
        )}
        <line x1={O.x} y1={O.y} x2="175" y2="55" stroke="var(--viz-accent-2)" strokeWidth="1.5" markerEnd="url(#cos-ar)" />
        <text x="180" y="56" fontSize="10" fill="var(--viz-accent-2)">B</text>
      </g>
      <circle cx={O.x} cy={O.y} r="2.5" fill="currentColor" />
      <text x="110" y="146" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">각도 좁음 = 유사 / 각도 넓음 = 다름</text>
    </svg>
  )
}

/** MoE(전문가 혼합): 입력마다 전체가 아니라 관련 전문가 일부만 켜진다. */
export function MoeDemo() {
  const reduced = useReducedMotion()
  const experts = [30, 58, 86, 114, 142] // y 위치
  return (
    <svg viewBox="0 0 300 175" style={svgBox} fontFamily="inherit" role="img" aria-label="입력마다 전문가 5명 중 2명만 켜지는 희소 라우팅">
      <style>{`
        .moe-x { animation: moe-on 5s ease-in-out infinite; opacity: 0.25; }
        @keyframes moe-on { 0%,100% { opacity: 0.25; } 45%,55% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .moe-x { animation: none; opacity: 1; } }
      `}</style>
      <defs>
        <marker id="moe-ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
      </defs>
      <g fontSize="9" textAnchor="middle">
        <rect x="6" y="74" width="44" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="28" y="90" fill="currentColor">입력</text>
        <rect x="80" y="74" width="44" height="26" rx="5" fill="none" stroke="var(--viz-accent)" strokeWidth="1" />
        <text x="102" y="90" fill="currentColor">라우터</text>
        <rect x="250" y="74" width="44" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="272" y="90" fill="currentColor">출력</text>
      </g>
      <line x1="50" y1="87" x2="78" y2="87" stroke="var(--viz-muted)" strokeWidth="1" markerEnd="url(#moe-ar)" />
      {experts.map((y, i) => (
        <g key={i} className={reduced ? undefined : 'moe-x'} style={reduced ? undefined : { animationDelay: `${i}s` }}>
          <line x1="124" y1="87" x2="176" y2={y + 11} stroke="var(--viz-accent)" strokeWidth="1" />
          <rect x="178" y={y} width="52" height="22" rx="4" fill="none" stroke="var(--viz-accent-2)" strokeWidth="1" />
          <text x="204" y={y + 15} textAnchor="middle" fontSize="9" fill="currentColor">전문가{i + 1}</text>
          <line x1="230" y1={y + 11} x2="250" y2="87" stroke="var(--viz-accent)" strokeWidth="1" />
        </g>
      ))}
      <text x="150" y="170" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">매번 일부 전문가만 켜서 크지만 빠르게</text>
    </svg>
  )
}

/** 임베딩: 흩어진 단어들이 뜻이 비슷한 것끼리 무리로 모인다. (정적 SVG 대체) */
export function EmbeddingDemo() {
  const reduced = useReducedMotion()
  // [흩어진 좌표] → [무리 좌표]
  const pts = [
    { s: [150, 100], c: [78, 62], g: 'accent', label: '사과' },
    { s: [140, 120], c: [112, 70], g: 'accent', label: '포도' },
    { s: [160, 90], c: [92, 100], g: 'accent', label: '배' },
    { s: [150, 110], c: [208, 128], g: 'accent2', label: '자동차' },
    { s: [145, 95], c: [252, 132], g: 'accent2', label: '비행기' },
    { s: [155, 115], c: [230, 160], g: 'accent2', label: '배' },
  ]
  const col = (g: string) => (g === 'accent' ? 'var(--viz-accent)' : 'var(--viz-accent-2)')
  return (
    <svg viewBox="0 0 320 210" style={svgBox} fontFamily="inherit" role="img" aria-label="흩어진 단어들이 과일 무리와 탈것 무리로 모이는 모습">
      <line x1="30" y1="185" x2="300" y2="185" stroke="var(--viz-muted)" strokeWidth="1" />
      <line x1="30" y1="185" x2="30" y2="20" stroke="var(--viz-muted)" strokeWidth="1" />
      <ellipse cx="95" cy="80" rx="52" ry="42" fill="none" stroke="var(--viz-accent)" strokeWidth="1" strokeDasharray="4 3" />
      <ellipse cx="230" cy="140" rx="56" ry="40" fill="none" stroke="var(--viz-accent-2)" strokeWidth="1" strokeDasharray="4 3" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.s[0]} cy={p.s[1]} r="3" fill={col(p.g)}>
            {!reduced && <animate attributeName="cx" values={`${p.s[0]};${p.c[0]};${p.c[0]};${p.s[0]}`} keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite" />}
            {!reduced && <animate attributeName="cy" values={`${p.s[1]};${p.c[1]};${p.c[1]};${p.s[1]}`} keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite" />}
            {reduced && <animate attributeName="cx" values={`${p.c[0]}`} dur="0s" fill="freeze" />}
          </circle>
          {reduced && <circle cx={p.c[0]} cy={p.c[1]} r="3" fill={col(p.g)} />}
        </g>
      ))}
      <text x="95" y="30" textAnchor="middle" fontSize="10" fill="currentColor">과일 무리</text>
      <text x="230" y="94" textAnchor="middle" fontSize="10" fill="currentColor">탈것 무리</text>
    </svg>
  )
}

/** Function Calling: 모델이 도구에 요청을 보내고 결과를 돌려받는다. */
export function FunctionCallingDemo() {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 260 110" style={svgBox} fontFamily="inherit" role="img" aria-label="모델이 도구에 요청을 보내고 결과를 돌려받는 왕복 흐름">
      <defs>
        <marker id="fc-ar" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--viz-muted)" strokeWidth="1" />
        </marker>
      </defs>
      <g fontSize="10" textAnchor="middle">
        <rect x="14" y="42" width="66" height="28" rx="5" fill="none" stroke="var(--viz-accent)" strokeWidth="1" />
        <text x="47" y="60" fill="currentColor">모델</text>
        <rect x="180" y="42" width="66" height="28" rx="5" fill="none" stroke="var(--viz-accent-2)" strokeWidth="1" />
        <text x="213" y="60" fill="currentColor">도구</text>
      </g>
      {/* 요청(위 화살표), 결과(아래 화살표) */}
      <path d="M82,50 C120,30 140,30 178,50" fill="none" stroke="var(--viz-muted)" strokeWidth="1" markerEnd="url(#fc-ar)" />
      <text x="130" y="26" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">요청</text>
      <path d="M178,62 C140,82 120,82 82,62" fill="none" stroke="var(--viz-muted)" strokeWidth="1" markerEnd="url(#fc-ar)" />
      <text x="130" y="94" textAnchor="middle" fontSize="9" fill="var(--viz-muted)">결과</text>
      {!reduced && (
        <>
          <circle r="3" fill="var(--viz-accent)"><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear" path="M82,50 C120,30 140,30 178,50" /></circle>
          <circle r="3" fill="var(--viz-accent-2)"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear" path="M178,62 C140,82 120,82 82,62" /></circle>
        </>
      )}
    </svg>
  )
}
