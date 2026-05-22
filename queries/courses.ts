import { createQueryKeys } from '@lukemorales/query-key-factory';
import { CourseListResponse } from '@/mock/courses';
import { getApiUrl } from '@/lib/get-api-url';

export const courseKeys = createQueryKeys('courses', {
  list: (category?: string) => ({
    queryKey: [{ category }],
    queryFn: () => fetchCourses(category),
  }),
});

export const fetchCourses = async (category?: string): Promise<CourseListResponse> => {
  const path = category ? `/api/courses?category=${category}` : '/api/courses';
  const res = await fetch(getApiUrl(path));

  return res.json();
};
