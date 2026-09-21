# kdh-html 프로젝트 홈 운영 가이드

이 문서는 앞으로 "html 만들어줘", "배포해줘", "홈에 추가해줘"라고 요청할 때 기준으로 삼는 운영 규칙입니다.

## 목표

- `https://kdh-html-project.vercel.app`를 프로젝트 홈으로 사용한다.
- 새 HTML 프로젝트는 루트 아래에 의미 있는 폴더명으로 만든다.
- 홈 화면 `index.html`에는 모든 프로젝트 바로가기를 카드 형태로 추가한다.
- 배포 경로와 실제 외부 URL을 헷갈리지 않게 문서에 남긴다.
- 페이지마다 색은 달라도 카드, 버튼, 여백, 타이포그래피는 비슷한 느낌으로 유지한다.

## 현재 프로젝트 목록

| 이름 | 폴더 | 배포/외부 URL | 설명 |
| --- | --- | --- | --- |
| 프로젝트 홈 | `/` | `https://kdh-html-project.vercel.app` | 모든 프로젝트 바로가기 허브 |
| SKCT 심층·인지 대비 가이드 | `skct_html` | `https://kdh-html-project.vercel.app/skct_html/` | 11개 회차 모의고사, O/X/△ 채점, 클라우드 실시간 동기화 |
| OPIc IM3 스피킹 프렙 | `opic_answer_html` | `https://kdh-html-project.vercel.app/opic_answer_html/` | 유형별 가이드 & 실전 모의고사 (음성인식/TTS) |
| 홋카이도 여행 | `hokkaido_html` | `https://kdh-hokkaido.lovable.app/` | Lovable로 만든 여행 페이지 |
| J-1 비자 비용 안내 | `visa_html` | `https://visa-html-five.vercel.app` | 비자 비용/환불 규정 안내 |
| J-1 서류 준비 타임라인 | `j1_visa_preparation` | `https://kdh-html-project.vercel.app/j1_visa_preparation/` | 체크리스트, 마감일, 메모 |

## 새 HTML 프로젝트를 만들 때 규칙

1. 폴더명은 영어 소문자와 `_`만 사용한다.
   - 좋은 예: `j1_visa_preparation`, `school_documents`, `travel_budget`
   - 피할 예: `new folder`, `비자서류`, `test1`
2. 폴더 안에는 기본적으로 `index.html`을 만든다.
3. 루트 `index.html` 프로젝트 홈에 카드 하나를 추가한다.
4. 루트 프로젝트를 Vercel에 배포한다.
   - 명령: `vercel --prod --yes`
5. 배포 후 확인할 URL은 보통 아래 형식이다.
   - `https://kdh-html-project.vercel.app/폴더명/`

## 스타일 기준

- 기본 폰트: `Malgun Gothic`, `Apple SD Gothic Neo`, `Arial`, `sans-serif`
- 카드 반경: `8px`
- 배경은 밝은 회색 또는 흰색 계열
- 버튼은 한 페이지에 1개의 주요 색상을 정하고, 보조 버튼은 흰색 배경과 테두리 사용
- 글자 크기는 모바일에서 깨지지 않게 `clamp()` 또는 고정 크기 중심으로 사용
- 페이지 구조는 대체로 다음 순서를 따른다.
  - 헤더
  - 핵심 요약 카드
  - 주요 콘텐츠 카드
  - 메모 또는 안내 박스

## 배포 기준

- 루트 홈과 루트 하위 HTML 프로젝트는 `kdh-html-project` Vercel 프로젝트에 배포한다.
- 별도 서비스에서 만든 프로젝트는 실제 외부 URL을 홈 카드에 직접 연결한다.
  - 예: 홋카이도는 Vercel이 아니라 Lovable URL 사용
- 배포 후에는 최소한 아래 두 가지를 확인한다.
  - 홈: `https://kdh-html-project.vercel.app`
  - 새 프로젝트: `https://kdh-html-project.vercel.app/폴더명/`

## 개인 서류 파일 공개 기준

여권, 학생증, 증명사진, 이력서, 예방접종증명서 같은 파일은 개인정보가 많으므로 Vercel 정적 폴더에 그대로 올리는 방식은 기본적으로 피한다.

### 가능한 방법

1. Google Drive 링크 사용
   - 추천 방식.
   - 파일을 Google Drive에 올린 뒤 공유 설정을 `링크가 있는 사용자: 보기 가능`으로 둔다.
   - HTML에는 해당 Drive URL을 버튼으로 연결한다.
   - 필요 없어진 뒤 링크 공유를 끄면 접근을 막을 수 있다.

2. Vercel 정적 파일로 업로드
   - 기술적으로 가능.
   - 예: `j1_visa_preparation/files/Resume.pdf`를 넣으면 `/j1_visa_preparation/files/Resume.pdf`로 열 수 있다.
   - 단점: 링크를 아는 사람은 누구나 접근 가능하고, 인증/만료/다운로드 기록 관리가 어렵다.
   - 개인정보 문서에는 권장하지 않는다.

3. 비공개 저장소/Supabase/Firebase 사용
   - 로그인, 만료 링크, 접근 제어가 필요할 때 사용한다.
   - 구현 시간이 더 든다.

## 서류 링크를 HTML에 넣을 때 권장 형식

```html
<a href="GOOGLE_DRIVE_FILE_URL" target="_blank" rel="noopener">Resume.pdf 보기</a>
```

Google Drive URL을 받은 뒤 `j1_visa_preparation/index.html`에 "제출 서류 링크" 섹션을 만들어 연결한다.

## 앞으로 요청 예시

```text
PROJECT_HUB_GUIDE.md 참고해서 새 HTML 프로젝트 만들어줘.
주제는 OOO이고 폴더명은 네가 적절히 정해줘.
홈에도 바로가기 추가하고 Vercel에 배포해줘.
```
