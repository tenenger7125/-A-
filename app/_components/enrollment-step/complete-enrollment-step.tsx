'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { EnrollmentApplicationType, EnrollmentStep, enrollmentFormStore } from '@/store/enrollment-form-store';

const CompleteEnrollmentStep = ({ step, onResetClick }: CompleteEnrollmentStepProps) => {
  const { currentStep, form } = enrollmentFormStore();

  return (
    currentStep === step && (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-12 text-center space-y-6">
          <div className="inline-block p-4 bg-green-100 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">신청이 완료되었습니다!</h2>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">강의:</span> {form.selectedCourse?.title}
            </p>
            <p>
              <span className="font-medium">신청자:</span> {form.applicant.name}
            </p>
            <p>
              <span className="font-medium">신청 유형:</span>{' '}
              {form.type === EnrollmentApplicationType.PERSONAL ? '개인' : '단체'}
            </p>
          </div>
          <Button onClick={onResetClick} className="w-full bg-blue-600 hover:bg-blue-700">
            새로 신청하기
          </Button>
        </CardContent>
      </Card>
    )
  );
};

export default CompleteEnrollmentStep;

interface CompleteEnrollmentStepProps {
  step: EnrollmentStep;
  onResetClick: () => void;
}
