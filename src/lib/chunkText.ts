export interface Chunk {
  text: string
  start: number
  end: number // exclusive
}

/**
 * 텍스트를 size 길이 조각으로 자르되 overlap 만큼 겹치게 나눔.
 * step = size - overlap 만큼 전진. overlap이 size 이상이면 무한루프이므로 보정.
 */
export function chunkText(text: string, size: number, overlap: number): Chunk[] {
  if (size <= 0) return []
  const safeOverlap = Math.max(0, Math.min(overlap, size - 1))
  const step = size - safeOverlap
  const chunks: Chunk[] = []
  for (let start = 0; start < text.length; start += step) {
    const end = Math.min(start + size, text.length)
    chunks.push({ text: text.slice(start, end), start, end })
    if (end >= text.length) break
  }
  return chunks
}
