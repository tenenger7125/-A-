'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Course, CourseListResponse } from '@/mock/courses';
import { courseKeys } from '@/queries/courses';

import {
  EnrollmentApplicationType,
  enrollmentFormStore,
  EnrollmentStep,
  type EnrollmentFormStoreState,
} from '@/store/enrollment-form-store';

const enrollmentApplications = [
  { value: EnrollmentApplicationType.INDIVIDUAL, label: '개인 신청' },
  { value: EnrollmentApplicationType.GROUP, label: '단체 신청' },
];

const SelectCourseStep = ({ step, onNextStepClick, initialData }: SelectCourseStepProps) => {
  const { data } = useQuery({ ...courseKeys.list(), initialData });

  const { currentStep, setForm, form } = enrollmentFormStore();
  const [error, setError] = useState<string | null>(null);

  const { courses, categories } = data;

  const handleCourseSelect = (selectedCourse: Course) => {
    setForm({ selectedCourse });
    setError(null);
  };

  const handleApplicationTypeChange = (type: EnrollmentFormStoreState['form']['applicationType']) => {
    setForm({ applicationType: type });
    setError(null);
  };

  const handleNextStepClick = () => {
    if (!form.selectedCourse) {
      setError('강의를 선택해주세요');
      return;
    }

    onNextStepClick();
    setError(null);
  };

  return (
    currentStep === step && (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>1단계: 강의 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="grid gap-3">
                  {courses
                    .filter(l => l.category === category)
                    .map(course => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all text-left ${
                          form.selectedCourse?.id === course.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-400'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(course.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold text-blue-600">₩{course.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {form.selectedCourse && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">신청 유형 선택</p>
              <RadioGroup value={form.applicationType} onValueChange={handleApplicationTypeChange}>
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
