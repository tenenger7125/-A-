import { http, HttpResponse } from 'msw';
import { CATEGORIES, COURSES, CourseListResponse } from './courses';
import { EnrollmentRequest, EnrollmentResponse } from './enrollments';

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

    const response: EnrollmentResponse = {
      enrollmentId: crypto.randomUUID(),
      status: 'confirmed',
      enrolledAt: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
