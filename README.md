# AI 용어 사전

사내 비개발자·주니어가 AI 관련 용어를 빠르게 찾아보는 검색형 용어 사전입니다.
백엔드 없이 순수 정적 사이트로 동작하며, 용어 데이터는 `src/data/terms.json` 한 파일에 전부 들어 있습니다.

- 실시간 검색 · 오타 허용 · **한글 초성 검색**(`ㅇㅂㄷ` → 임베딩)
- 카테고리/난이도 필터, URL 딥링크(슬랙에 특정 용어 링크 공유)
- 일부 용어에 그림·인터랙티브 시각 자료
- 다크모드(시스템 설정 자동 추적 + 헤더 버튼으로 수동 토글), 모바일 반응형
- 키보드: `/` 검색 포커스, `↑`/`↓` 이동, `Enter` 열기, `Esc` 닫기

---

## 🙋 용어 추가하기 (비개발자용)

> **개발 지식이 없어도 됩니다.** `src/data/terms.json` 파일만 편집하면 용어가 추가됩니다.
> GitHub 웹사이트에서 바로 편집할 수 있습니다.

### 1. 파일 열기

GitHub 저장소에서 `src` → `data` → `terms.json` 파일을 클릭한 뒤,
오른쪽 위 **연필(✏️) 아이콘**을 눌러 편집 모드로 들어갑니다.

### 2. 용어 한 개 붙여넣기

파일은 `[` 로 시작해 `]` 로 끝나는 **목록**입니다.
기존 용어 하나는 `{ ... }` 한 덩어리입니다.
맨 아래 마지막 `}` 뒤에 **쉼표(,)를 찍고**, 아래 틀을 복사해 붙여넣으세요.

```json
{
  "id": "my-term",
  "term": "한글 이름",
  "termEn": "English Name",
  "aliases": ["다른 표현", "줄임말"],
  "category": "모델",
  "level": "기초",
  "oneLiner": "한 문장으로 핵심만.",
  "description": "AI를 전혀 모르는 사람이 읽는다고 생각하고 2~4문장으로 설명. 어려운 말은 반드시 풀어서.",
  "analogy": "일상적인 비유 한 문장.",
  "example": "실무에서 어떤 상황에 쓰이는지 구체적 예시.",
  "related": [],
  "confusedWith": []
}
```

### 3. 칸(필드) 설명

| 칸 | 뜻 | 규칙 |
|---|---|---|
| `id` | 이 용어의 고유 주소 | 영문 소문자·숫자·하이픈만. **다른 용어와 겹치면 안 됨** (예: `context-window`) |
| `term` | 한글 이름 | 화면에 크게 표시됨 |
| `termEn` | 영문 이름 | 없으면 한글과 같게 적어도 됨 |
| `aliases` | 별칭·다른 표현 | `["가", "나"]` 형태. 검색에 잡힘. 없으면 `[]` |
| `category` | 분류 | 아래 8개 중 **정확히 하나** |
| `level` | 난이도 | `기초` · `중급` · `심화` 중 하나 |
| `oneLiner` | 한 줄 요약 | 목록·상세 맨 위에 보임 |
| `description` | 설명 | 초보자 눈높이로 2~4문장 |
| `analogy` | 비유 | 일상 예로 한 문장 (없으면 `""`) |
| `example` | 실무 예시 | 어디에 쓰는지 (없으면 `""`) |
| `related` | 관련 용어 | 다른 용어의 **`id`** 목록. 예: `["rag", "vector"]`. 없으면 `[]` |
| `confusedWith` | 헷갈리는 개념 | 아래 형식 참고. 없으면 `[]` |

**`category`는 반드시 이 8개 중 하나** (오타 주의):
`데이터` · `학습파이프라인` · `저장검색` · `모델` · `실행` · `구조` · `지식그래프` · `문제평가`

`confusedWith`는 이렇게 적습니다 (헷갈리기 쉬운 다른 용어와 차이를 설명):

```json
"confusedWith": [
  { "id": "finetuning", "note": "이건 검색용, 저건 모델 재학습" }
]
```

### 4. ⚠️ 꼭 지킬 것 (안 지키면 화면이 안 뜹니다)

- **쉼표**: 항목과 항목 사이에는 쉼표 `,`, **마지막 항목 뒤에는 쉼표를 찍지 않습니다.**
- **큰따옴표**: 모든 글자값은 `"큰따옴표"`로 감쌉니다. `'작은따옴표'` 안 됨.
- **줄바꿈**: 설명 안에서 줄을 바꾸고 싶으면 그냥 이어 쓰거나 `\n`을 넣습니다.
- `related`·`confusedWith`에 적는 값은 **존재하는 용어의 `id`**여야 클릭 이동이 됩니다.

### 5. 저장(제안) 하기

편집이 끝나면 페이지 아래 **"Commit changes / 변경 제안"** 버튼을 누릅니다.
바로 반영 권한이 없다면 **Pull request**로 제안되며, 관리자가 확인 후 병합하면
사이트에 자동으로 배포됩니다.

> 형식이 걱정되면 [JSONLint](https://jsonlint.com) 에 붙여넣어 `Valid JSON` 이 나오는지
> 확인한 뒤 저장하면 안전합니다.

---

## 🖼️ (선택) 그림 넣기

용어에 `visual` 칸을 추가하면 상세 화면 위쪽에 그림이 표시됩니다. 없으면 텍스트만 나옵니다.

**이미 만든 SVG 그림 붙이기** — `src/visuals/` 폴더의 파일명을 지정합니다.

```json
"visual": {
  "type": "svg",
  "src": "/visuals/rag.svg",
  "caption": "그림 아래 한 줄 설명"
}
```

**인터랙티브 컴포넌트 붙이기** — 현재 준비된 것: `ChunkingDemo`, `TemperatureDemo`.

```json
"visual": { "type": "component", "name": "ChunkingDemo", "caption": "..." }
```

> 새 그림(SVG)이나 새 컴포넌트를 만드는 것은 개발자 작업입니다.
> 그림 색은 `currentColor` 와 CSS 변수(`--viz-accent` 등)만 쓰면 다크모드에서 자동으로 맞춰집니다.

---

## 👩‍💻 개발자용

### 로컬 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

### 검증 / 빌드

```bash
npm run typecheck              # 타입 체크
npm run build                  # 타입 체크 + 프로덕션 빌드(dist/)
node src/lib/chosung.check.ts  # 초성 검색 로직 셀프체크
node src/lib/chunkText.check.ts# 청킹 로직 셀프체크
```

### 기술 스택

React + Vite + TypeScript · Tailwind CSS v4 · Fuse.js(퍼지 검색, threshold 0.35).
라우팅 라이브러리 없이 URL 해시/쿼리스트링을 직접 다룹니다.
초성 검색은 Fuse.js가 지원하지 않아 `src/lib/chosung.ts` 에서 초성 인덱스를 따로 만들어 매칭합니다.

### 폴더 구조

```
src/
  data/terms.json          # ★ 용어 데이터 (여기만 고치면 용어 추가)
  visuals/*.svg            # 인라인 SVG 그림
  components/              # UI 컴포넌트
    visuals/               # 인터랙티브 시각 컴포넌트(ChunkingDemo 등)
  lib/                     # 검색·초성·URL·시각 레지스트리 등 로직
```

---

## 🚀 GitHub Pages 배포

`main` 브랜치에 푸시하면 GitHub Actions가 자동 빌드·배포합니다
(`.github/workflows/deploy.yml` 포함).

**최초 1회 설정**

1. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 변경
2. `main` 에 푸시 → Actions 탭에서 배포 확인
3. 게시 주소: `https://<계정>.github.io/<저장소이름>/`

`vite.config.ts` 의 `base` 는 `'./'`(상대경로)라 저장소 이름과 무관하게 하위 경로에서 동작합니다.
커스텀 도메인을 붙이면 `base: '/'` 로 바꾸세요.

---

## 🔧 배포 전 바꿀 곳

- **이슈 제보 링크**: `src/App.tsx` 의 `ISSUE_URL` 값 `https://github.com/OWNER/REPO/issues/new`
  를 실제 저장소 주소로 교체하세요. (검색 결과가 없을 때 "제보해 주세요" 링크에 쓰입니다.)
