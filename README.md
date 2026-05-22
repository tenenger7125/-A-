# FutureSchole — 수강 신청 폼

## 프로젝트 개요

온라인 교육 플랫폼에서 강의 수강 신청 흐름을 다단계 폼으로 구현한 과제 프로젝트입니다.  
폼 상태 관리, 유효성 검증 설계, 조건부 필드 처리, 스텝 간 데이터 흐름을 안정적이고 사용자 친화적으로 설계하는 것을 목표로 합니다.

**신청 흐름**: 강의 선택 → 신청 정보 입력 → 최종 확인 → 완료

---

## 기술 스택

| 분류        | 라이브러리                           | 선택 이유                                                                       |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| 프레임워크  | Next.js 16 (App Router)              | SSR로 강의 목록 초기 데이터 제공, 파일 기반 라우팅                              |
| UI          | React 19, Tailwind CSS v4, shadcn/ui | 빠른 프로토타이핑, 접근성 있는 기본 컴포넌트                                    |
| 폼 상태     | React Hook Form v7                   | 비제어 컴포넌트 방식으로 불필요한 리렌더 최소화, 풍부한 유효성 검증 API         |
| 전역 상태   | Zustand v5 + `persist`               | 스텝 간 데이터 공유, sessionStorage 직렬화로 새로고침 시 진행 상태 보존         |
| 유효성 검증 | Zod v3                               | TypeScript 타입 추론과 스키마를 단일 소스로 관리, `superRefine`으로 조건부 검증 |
| 서버 상태   | TanStack Query v5                    | SSR `initialData` + CSR 폴링 하이브리드, 캐시 및 로딩 상태 관리                 |
| API 모킹    | MSW v2                               | 실제 백엔드 없이 네트워크 수준 mock, 브라우저/서버 양쪽 지원                    |
| 알림        | Sonner                               | 로딩·성공·에러 상태를 toast로 non-blocking 피드백                               |
| 아이콘      | lucide-react                         | Tailwind와 호환성 좋은 SVG 아이콘                                               |

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (MSW 자동 활성화)
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 프로젝트 구조 설명

```
app/
  page.tsx                         # SSR: 강의 목록 fetch 후 initialData로 전달
  layout.tsx                       # MSW Provider, QueryClient Provider 세팅
  _components/
    course-enrollment.tsx          # 스텝 오케스트레이터 (현재 스텝에 따라 컴포넌트 렌더)
    enrollment-progress-bar/       # 스텝 진행 표시 바
    enrollment-step/
      select-course-step.tsx       # Step 1: 강의 선택, 신청 유형 선택
      insert-enroll-info-step.tsx  # Step 2: 신청자 정보 입력 (개인/단체 분기)
      confirm-enrollment-step.tsx  # Step 3: 최종 확인 및 제출
      complete-enrollment-step.tsx # Step 4: 신청 완료 화면
  _schemas/
    enrollment-schema.ts           # Zod 스키마 (유효성 검증 단일 소스)

store/enrollment-form-store/       # Zustand 스토어 (스텝 상태 + 폼 데이터 persist)

queries/
  courses.ts                       # useQuery: 강의 목록
  enrollments.ts                   # useMutation: 수강 신청 제출

mock/
  handlers.ts                      # MSW 핸들러 (GET /api/courses, POST /api/enrollments)
  courses.ts                       # 강의 목 데이터
  enrollments.ts                   # 신청 응답 타입 및 에러 클래스
```

---

## 요구사항 해석 및 가정

- **개인 vs 단체 신청 분기**: `type` 필드로 구분하고, `GROUP`일 때만 단체 전용 필드(단체명, 참가자 목록, 담당자 연락처)를 렌더링 및 검증
- **참가자 수 제한**: 단체 신청은 최소 2명, 최대 10명으로 제한 (useFieldArray 동적 관리)
- **정원 마감 처리**: `maxCapacity === currentEnrollment`이면 선택 불가(disabled), 80% 이상이면 "마감 임박" 경고 표시
- **API 에러 분기**: `COURSE_FULL`, `DUPLICATE_ENROLLMENT`, `INVALID_INPUT` 에러 코드를 서버 응답으로 수신하여 각 상황에 맞는 메시지 표시

---

## 설계 결정과 이유

### 폼 상태 관리: Zustand(전역) + React Hook Form(로컬) 이중 구조

두 라이브러리가 담당하는 범위를 명확히 분리했습니다.

| 역할                              | 담당                               |
| --------------------------------- | ---------------------------------- |
| 스텝 간 이동 및 데이터 공유       | Zustand                            |
| 각 스텝 내 입력값·에러·dirty 상태 | React Hook Form                    |
| 새로고침 후 진행 상태 복원        | Zustand `persist` (sessionStorage) |

React Hook Form 단독으로 전역 공유를 하려면 Context를 통해 `useFormContext`를 모든 스텝에 내려야 하는데, 이는 불필요한 리렌더 및 결합도 상승을 유발합니다. Zustand를 전역 저장소로 두고, RHF는 현재 스텝의 제어만 담당하게 분리하면 각 스텝이 독립적으로 마운트/언마운트될 수 있습니다.

### 유효성 검증 전략: 스텝별 클라이언트 검증 + 서버 에러 처리

- **스텝 2 (정보 입력)**: `mode: 'onBlur'`로 입력 완료 시점에 Zod 스키마 검증. 사용자가 타이핑 중에 에러가 뜨는 것을 방지
- **스텝 3 (최종 확인)**: 이미 검증된 데이터를 보여주므로 클라이언트 재검증 없이 제출. 서버 응답의 에러 코드(`COURSE_FULL` 등)로 후처리
- **전체 유효성 검증을 한 번에 하지 않은 이유**: 각 스텝에서 즉각적인 피드백을 주는 것이 사용자 경험에 유리하며, 스텝 1(강의 선택)은 별도 Zod 스키마가 필요 없는 단순 선택 UI이기 때문

### 조건부 필드 데이터 처리: superRefine + 렌더링 분기

Zod `.superRefine()`을 사용하여 `type === 'GROUP'`일 때만 단체 전용 필드 검증을 실행합니다. 개인 신청 시 `group` 필드의 값은 스토어에 남아 있지만 API 요청 바디 생성 시 `type`에 따라 포함 여부를 분기하여 서버에 불필요한 데이터를 전송하지 않습니다.

### SSR + CSR 하이브리드: TanStack Query initialData

`page.tsx`에서 서버 사이드로 강의 목록을 fetch한 뒤 `initialData`로 `useQuery`에 전달합니다. 초기 렌더 시 로딩 없이 강의 목록을 즉시 표시하고, 이후 CSR에서 `isFetching`으로 백그라운드 갱신 상태를 UI에 반영합니다.

---

## 미구현 / 제약사항

- **실제 백엔드 API 없음**: MSW(Mock Service Worker)로 네트워크 수준에서 모킹. 실제 서버 배포 시 `mock/handlers.ts`를 실제 엔드포인트로 교체 필요
- **이메일/SMS 인증 없음**: 신청자 이메일 형식 검증만 수행, 실제 소유 확인 절차 미구현
- **결제 연동 없음**: 강의 가격 표시만 하며 결제 플로우 미포함
- **테스트 코드 미작성**: 환경(jest + Testing Library) 세팅은 완료되어 있으나 테스트 케이스 미작성

---

## AI 활용 범위

GitHub Copilot을 코드 구조 설계 및 구현 전반에 걸쳐 보조 도구로 활용했습니다.

| 활용 영역     | 상세 내용                                                           |
| ------------- | ------------------------------------------------------------------- |
| 컴포넌트 설계 | 스텝별 컴포넌트 분리 구조 및 props 인터페이스 초안 생성             |
| 상태 관리     | Zustand 스토어 타입 정의 및 persist 설정                            |
| 유효성 검증   | Zod `superRefine` 조건부 검증 로직, 이메일 중복 검사                |
| UX 기능       | 전화번호 하이픈 자동 입력, `beforeunload` 이탈 방지, 정원 상태 배지 |
| 스타일링      | Tailwind 유틸리티 클래스 조합, 반응형 브레이크포인트 적용           |

설계 방향 및 요구사항 해석은 직접 수행하고, 반복적인 구현 코드 작성과 타입 오류 해결에 Copilot을 활용했습니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
