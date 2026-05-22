export type Lecture = {
  id: string;
  category: string;
  title: string;
  price: number;
  schedule: string;
}

export const LECTURES: Lecture[] = [
  { id: '1', category: '웹개발', title: 'React 완벽 가이드', price: 99000, schedule: '2025-06-15 ~ 2025-07-15' },
  { id: '2', category: '웹개발', title: 'TypeScript 마스터', price: 79000, schedule: '2025-06-22 ~ 2025-07-22' },
  { id: '3', category: '백엔드', title: 'FastAPI 실전', price: 89000, schedule: '2025-06-20 ~ 2025-07-20' },
  { id: '4', category: '백엔드', title: 'Node.js 심화', price: 89000, schedule: '2025-07-01 ~ 2025-08-01' },
  { id: '5', category: 'DevOps', title: 'Docker & Kubernetes', price: 119000, schedule: '2025-07-10 ~ 2025-08-10' },
  { id: '6', category: 'DevOps', title: 'CI/CD 파이프라인 구축', price: 99000, schedule: '2025-06-25 ~ 2025-07-25' },
];