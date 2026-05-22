'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Course, CourseListResponse } from '@/mock/courses';
import { courseKeys } from '@/queries/courses';

import {
  EnrollmentApplicationType,
  enrollmentFormStore,
  EnrollmentStep,
  type EnrollmentFormStoreState,
} from '@/store/enrollment-form-store';

const ALMOST_FULL_THRESHOLD = 0.8;
const ALMOST_FULL_REMAINING = 5;

const getRemainingSeats = (course: Course) => course.maxCapacity - course.currentEnrollment;
const isFull = (course: Course) => getRemainingSeats(course) <= 0;
const isAlmostFull = (course: Course) => {
  const remaining = getRemainingSeats(course);
  return (
    !isFull(course) &&
    (remaining <= ALMOST_FULL_REMAINING || course.currentEnrollment / course.maxCapacity >= ALMOST_FULL_THRESHOLD)
  );
};

const enrollmentApplications = [
  { value: EnrollmentApplicationType.PERSONAL, label: '개인 신청' },
  { value: EnrollmentApplicationType.GROUP, label: '단체 신청' },
];

const SelectCourseStep = ({ step, onNextStepClick, initialData }: SelectCourseStepProps) => {
  const { data, isFetching } = useQuery({ ...courseKeys.list(), initialData });

  const { currentStep, setForm, form } = enrollmentFormStore();
  const [error, setError] = useState<string | null>(null);

  const { courses, categories } = data;

  const handleCourseSelect = (selectedCourse: Course) => {
    setForm({ selectedCourse });
    setError(null);
  };

  const handleApplicationTypeChange = (type: EnrollmentFormStoreState['form']['type']) => {
    setForm({ type });
    setError(null);
  };

  const handleNextStepClick = () => {
    if (!form.selectedCourse) {
      setError('강의를 선택해주세요');
      return;
    }

    const latestCourse = courses.find(c => c.id === form.selectedCourse?.id);
    if (latestCourse && isFull(latestCourse)) {
      setError('선택한 강의의 정원이 마감되었습니다. 다른 강의를 선택해주세요.');
      setForm({ selectedCourse: undefined });
      return;
    }

    onNextStepClick();
    setError(null);
  };

  return (
    currentStep === step && (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            1단계: 강의 선택
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isFetching && !data ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 rounded-lg border-2 border-gray-200 bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <p className="text-lg font-medium">현재 신청 가능한 강의가 없습니다</p>
                <p className="text-sm mt-1">새로운 강의가 열리면 알려드릴게요</p>
              </div>
            ) : (
              <div className={isFetching ? 'opacity-60 pointer-events-none' : ''}>
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                    <div className="grid gap-3">
                      {courses
                        .filter(l => l.category === category)
                        .map(course => (
                          <button
                            key={course.id}
                            onClick={() => !isFull(course) && handleCourseSelect(course)}
                            disabled={isFull(course)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              isFull(course)
                                ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                                : form.selectedCourse?.id === course.id
                                  ? 'cursor-pointer border-blue-600 bg-blue-50'
                                  : 'cursor-pointer border-gray-200 hover:border-blue-400'
                            }`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-gray-900">{course.title}</p>
                                  {isFull(course) && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium shrink-0">
                                      마감
                                    </span>
                                  )}
                                  {isAlmostFull(course) && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium shrink-0">
                                      마감 임박
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {new Date(course.startDate).toLocaleDateString()}
                                </p>
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                                    <span>
                                      {isFull(course) ? '정원 마감' : `잔여 ${getRemainingSeats(course)}석`}
                                    </span>
                                    <span>
                                      {course.currentEnrollment}/{course.maxCapacity}명
                                    </span>
                                  </div>
                                  <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isFull(course)
                                          ? 'bg-red-500'
                                          : isAlmostFull(course)
                                            ? 'bg-orange-400'
                                            : 'bg-blue-400'
                                      }`}
                                      style={{
                                        width: `${Math.min(100, (course.currentEnrollment / course.maxCapacity) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <p className="font-bold text-blue-600 shrink-0">₩{course.price.toLocaleString()}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {form.selectedCourse && isAlmostFull(form.selectedCourse) && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                선택한 강의는 잔여{' '}
                <strong>{getRemainingSeats(form.selectedCourse)}석</strong>으로 마감이 임박했습니다. 빠르게 신청하세요!
              </AlertDescription>
            </Alert>
          )}

          {form.selectedCourse && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">신청 유형 선택</p>
              <RadioGroup value={form.type} onValueChange={handleApplicationTypeChange}>
                <div className="flex items-center gap-4">
                  {enrollmentApplications.map(({ value, label }) => (
                    <div className="flex items-center space-x-2" key={value}>
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          <Button
            disabled={!!error}
            onClick={handleNextStepClick}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:hover:bg-gray-700">
            다음 단계 <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  );
};

export default SelectCourseStep;

interface SelectCourseStepProps {
  step: EnrollmentStep;
  onNextStepClick: () => void;
  initialData: CourseListResponse;
}
