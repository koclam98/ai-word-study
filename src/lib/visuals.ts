import type { ComponentType } from 'react'
import { ChunkingDemo } from '../components/visuals/ChunkingDemo'
import { TemperatureDemo } from '../components/visuals/TemperatureDemo'
import { RagFlowDemo, ContextWindowDemo } from '../components/visuals/FlowDemos'
import {
  StreamingDemo,
  TokenizeDemo,
  CotDemo,
  QuantizationDemo,
  RerankingDemo,
} from '../components/visuals/TextVisuals'
import {
  AgentLoopDemo,
  AttentionDemo,
  HybridSearchDemo,
  AnnSearchDemo,
  CosineSimDemo,
  MoeDemo,
  EmbeddingDemo,
  FunctionCallingDemo,
} from '../components/visuals/DiagramVisuals'

// src/visuals/*.svg 를 빌드타임에 raw 문자열로 인라인 → fetch 없이 currentColor/CSS변수 상속.
const svgModules = import.meta.glob('../visuals/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const SVG_BY_NAME: Record<string, string> = {}
for (const [path, raw] of Object.entries(svgModules)) {
  const name = path.split('/').pop()! // embedding.svg
  SVG_BY_NAME[name] = raw
}

/** visual.src("/visuals/embedding.svg" 등)에서 인라인 SVG 문자열을 찾음. */
export function getSvg(src: string | undefined): string | null {
  if (!src) return null
  return SVG_BY_NAME[src.split('/').pop()!] ?? null
}

/** type === 'component' 용 레지스트리. JSON의 name과 매칭. */
export const COMPONENTS: Record<string, ComponentType> = {
  ChunkingDemo,
  TemperatureDemo,
  RagFlowDemo,
  ContextWindowDemo,
  StreamingDemo,
  TokenizeDemo,
  CotDemo,
  QuantizationDemo,
  RerankingDemo,
  AgentLoopDemo,
  AttentionDemo,
  HybridSearchDemo,
  AnnSearchDemo,
  CosineSimDemo,
  MoeDemo,
  EmbeddingDemo,
  FunctionCallingDemo,
}
