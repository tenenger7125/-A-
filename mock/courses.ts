export interface Course {
  id: string;
  title: string;
  description: string;
  category: string; // "development" | "design" | "marketing" | "business"
  price: number;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  instructor: string;
}

export interface CourseListResponse {
  courses: Course[];
  categories: string[];
}

export const CATEGORIES = ['development', 'design', 'marketing', 'business'] as const;

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'React 완벽 가이드',
    description: 'React의 핵심 개념부터 고급 패턴까지 실전 프로젝트와 함께 배우는 강의입니다.',
    category: 'development',
    price: 99000,
    maxCapacity: 30,
    currentEnrollment: 18,
    startDate: '2026-06-15T09:00:00.000Z',
    endDate: '2026-07-15T18:00:00.000Z',
    instructor: '김개발',
  },
  {
    id: '2',
    title: 'TypeScript 마스터',
    description: 'TypeScript의 타입 시스템을 깊이 이해하고 실무에서 바로 사용할 수 있는 강의입니다.',
    category: 'development',
    price: 79000,
    maxCapacity: 25,
    currentEnrollment: 25,
    startDate: '2026-06-22T09:00:00.000Z',
    endDate: '2026-07-22T18:00:00.000Z',
    instructor: '이타입',
  },
  {
    id: '3',
    title: 'Figma로 시작하는 UI 디자인',
    description: 'Figma 기초부터 컴포넌트 설계, 프로토타이핑까지 실무 중심으로 배우는 강의입니다.',
    category: 'design',
    price: 89000,
    maxCapacity: 20,
    currentEnrollment: 12,
    startDate: '2026-06-20T09:00:00.000Z',
    endDate: '2026-07-20T18:00:00.000Z',
    instructor: '박디자인',
  },
  {
    id: '4',
    title: 'UX 리서치 실전',
    description: '사용자 인터뷰, 설문 설계, 데이터 분석을 통해 실제 서비스를 개선하는 방법을 배웁니다.',
    category: 'design',
    price: 89000,
    maxCapacity: 15,
    currentEnrollment: 8,
    startDate: '2026-07-01T09:00:00.000Z',
    endDate: '2026-08-01T18:00:00.000Z',
    instructor: '최UX',
  },
  {
    id: '5',
    title: '디지털 마케팅 전략',
    description: 'SEO, SNS, 콘텐츠 마케팅을 아우르는 통합 디지털 마케팅 전략을 배웁니다.',
    category: 'marketing',
    price: 119000,
    maxCapacity: 30,
    currentEnrollment: 22,
    startDate: '2026-07-10T09:00:00.000Z',
    endDate: '2026-08-10T18:00:00.000Z',
    instructor: '정마케팅',
  },
  {
    id: '6',
    title: '콘텐츠 마케팅 A to Z',
    description: '브랜드 스토리텔링부터 바이럴 콘텐츠 제작까지 마케터가 꼭 알아야 할 모든 것을 다룹니다.',
    category: 'marketing',
    price: 99000,
    maxCapacity: 25,
    currentEnrollment: 10,
    startDate: '2026-06-25T09:00:00.000Z',
    endDate: '2026-07-25T18:00:00.000Z',
    instructor: '윤콘텐츠',
  },
  {
    id: '7',
    title: '스타트업 창업 전략',
    description: '아이디어 검증부터 MVP 출시, 투자 유치까지 창업의 전 과정을 실전 사례와 함께 배웁니다.',
    category: 'business',
    price: 129000,
    maxCapacity: 20,
    currentEnrollment: 14,
    startDate: '2026-07-15T09:00:00.000Z',
    endDate: '2026-08-15T18:00:00.000Z',
    instructor: '강비즈니스',
  },
  {
    id: '8',
    title: '비즈니스 모델 설계',
    description: '다양한 비즈니스 모델 프레임워크를 활용하여 지속 가능한 비즈니스를 설계하는 방법을 배웁니다.',
    category: 'business',
    price: 109000,
    maxCapacity: 20,
    currentEnrollment: 5,
    startDate: '2026-08-01T09:00:00.000Z',
    endDate: '2026-09-01T18:00:00.000Z',
    instructor: '임전략',
  },
];
