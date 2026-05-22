import { http, HttpResponse } from 'msw';
import { CATEGORIES, COURSES, CourseListResponse } from './courses';
import { EnrollmentRequest, EnrollmentResponse, ErrorResponse } from './enrollments';

export const handlers = (baseUrl: string) => [
  http.get(`${baseUrl}/api/courses`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    const filteredCourses =
      category && category !== 'all' ? COURSES.filter(course => course.category === category) : COURSES;

    const response: CourseListResponse = {
      courses: filteredCourses,
      categories: [...CATEGORIES],
    };

    return HttpResponse.json(response);
  }),

  http.post(`${baseUrl}/api/enrollments`, async ({ request }) => {
    const body = (await request.json()) as EnrollmentRequest;

    const course = COURSES.find(c => c.id === body.courseId);
    if (!course) {
      return HttpResponse.json({ message: '강의를 찾을 수 없습니다' }, { status: 404 });
    }

    // 테스트용: 특정 강의 ID로 에러 케이스 시뮬레이션
    if (course.id === 'COURSE_FULL_TEST') {
      const error: ErrorResponse = { code: 'COURSE_FULL', message: '정원이 초과되었습니다' };
      return HttpResponse.json(error, { status: 409 });
    }
    if (course.id === 'DUPLICATE_TEST') {
      const error: ErrorResponse = { code: 'DUPLICATE_ENROLLMENT', message: '이미 신청된 강의입니다' };
      return HttpResponse.json(error, { status: 409 });
    }

    const response: EnrollmentResponse = {
      enrollmentId: crypto.randomUUID(),
      status: 'confirmed',
      enrolledAt: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
