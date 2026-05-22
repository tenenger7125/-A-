import { http, HttpResponse } from 'msw';
import { CATEGORIES, COURSES, CourseListResponse } from './courses';

export const handlers = [
  http.get('/api/courses', ({ request }) => {
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
];
