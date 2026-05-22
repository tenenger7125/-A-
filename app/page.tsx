import CourseEnrollment from './_components/course-enrollment';
import { fetchCourses } from '@/queries/courses';

export default async function Page() {
  const initialData = await fetchCourses();

  return <CourseEnrollment initialData={initialData} />;
}
