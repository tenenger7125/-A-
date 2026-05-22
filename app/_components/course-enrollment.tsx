'use client';

import SelectCourseStep from './enrollment-step/select-course-step';
import InsertEnrollInfoStep from './enrollment-step/insert-enroll-info-step';
import ProgressBar from './enrollment-progress-bar/progress-bar';
import { enrollmentFormStore, EnrollmentStep } from '@/store/enrollment-form-store';
import { CourseListResponse } from '@/mock/courses';

interface CourseEnrollmentProps {
  initialData: CourseListResponse;
}

const CourseEnrollment = ({ initialData }: CourseEnrollmentProps) => {
  const { currentStep, setStep } = enrollmentFormStore();
  const enrollmentOrders = [EnrollmentStep.COURSE, EnrollmentStep.INFO, EnrollmentStep.CONFIRM];

  const handleNextStepClick = () => {
    const currentIndex = enrollmentOrders.indexOf(currentStep);
    const nextIndex = currentIndex + 1;
    const nextStep = enrollmentOrders[nextIndex];

    if (!nextStep) {
      throw new Error(`다음 단계는 존재하지 않습니다. step: ${nextStep}`);
    }

    setStep(nextStep);
  };

  const handleBackStepClick = () => {
    const currentIndex = enrollmentOrders.indexOf(currentStep);
    const backIndex = currentIndex - 1;
    const backStep = enrollmentOrders[backIndex];

    if (!backStep) {
      throw new Error(`이전 단계는 존재하지 않습니다. step: ${backStep}`);
    }

    setStep(backStep);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">강의 신청</h1>
          <p className="text-gray-600">단 3단계로 원하는 강의를 신청하세요</p>
        </div>

        <ProgressBar values={enrollmentOrders} />
        <SelectCourseStep
          step={EnrollmentStep.COURSE}
          onNextStepClick={handleNextStepClick}
          initialData={initialData}
        />
        <InsertEnrollInfoStep
          step={EnrollmentStep.INFO}
          onNextStepClick={handleNextStepClick}
          onBackStepClick={handleBackStepClick}
        />
      </div>
    </div>
  );
};

export default CourseEnrollment;
