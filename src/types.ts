export type Category =
  | '데이터'
  | '저장검색'
  | '모델'
  | '실행'
  | '구조'
  | '지식그래프'
  | '문제평가'

export type Level = '기초' | '중급' | '심화'

export interface ConfusedWith {
  id: string
  note: string
}

export type VisualType = 'svg' | 'mermaid' | 'component'

export interface Visual {
  type: VisualType
  src?: string // type === 'svg' — 예: "/visuals/embedding.svg"
  code?: string // type === 'mermaid'
  name?: string // type === 'component' — 컴포넌트 레지스트리 키
  caption?: string
}

export interface Term {
  id: string
  term: string
  termEn: string
  aliases: string[]
  category: Category
  level: Level
  oneLiner: string
  description: string
  analogy: string
  example: string
  related: string[]
  confusedWith: ConfusedWith[]
  visual?: Visual
}

export const CATEGORIES: Category[] = [
  '데이터',
  '저장검색',
  '모델',
  '실행',
  '구조',
  '지식그래프',
  '문제평가',
]

export const LEVELS: Level[] = ['기초', '중급', '심화']
