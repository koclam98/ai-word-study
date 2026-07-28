import type { Category } from '../types'

// 카테고리별 은은한 컬러 태그. 라이트/다크 모두 배경+텍스트 지정.
// Tailwind가 클래스를 정적으로 스캔하므로 full 클래스 문자열로 적어 둠.
export const CATEGORY_STYLE: Record<Category, string> = {
  데이터: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  학습파이프라인: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  저장검색: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  모델: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  실행: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  구조: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  지식그래프: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  문제평가: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}
