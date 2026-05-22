'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnrollmentApplicationType, EnrollmentStep, enrollmentFormStore } from '@/store/enrollment-form-store';
import { useSubmitEnrollmentMutation } from '@/queries/enrollments';
import { EnrollmentApiError, EnrollmentRequest } from '@/mock/enrollments';

const ConfirmEnrollmentStep = ({ step, onNextStepClick, onBackStepClick }: ConfirmEnrollmentStepProps) => {
  const { currentStep, form, setForm, setStep } = enrollmentFormStore();
  const [termsError, setTermsError] = useState<string | null>(null);
  const { mutate: submitEnrollment, isPending } = useSubmitEnrollmentMutation();

  const handleSubmit = () => {
    if (isPending) {
      toast.info('이미 신청 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!form.agreedToTerms) {
      setTermsError('이용약관에 동의해주세요');
      return;
    }
    if (!form.selectedCourse) return;

    const { motivation, ...applicantRest } = form.applicant;
    const applicant = { ...applicantRest, ...(motivation ? { motivation } : {}) };
    const common = { courseId: form.selectedCourse.id, applicant, agreedToTerms: form.agreedToTerms };
    const body: EnrollmentRequest =
      form.type === EnrollmentApplicationType.GROUP
        ? { ...common, type: form.type, group: form.group }
        : { ...common, type: form.type };

    submitEnrollment(body, {
      onSuccess: () => onNextStepClick(),
      onError: (e: EnrollmentApiError) => {
        if (e.code === 'COURSE_FULL') {
          toast.error('수강 신청 불가', {
            description: '정원이 초과되어 신청할 수 없습니다. 다른 강의를 선택해 주세요.',
            action: { label: '강의 다시 선택', onClick: () => setStep(EnrollmentStep.COURSE) },
            duration: Infinity,
          });
        } else if (e.code === 'DUPLICATE_ENROLLMENT') {
          toast.error('중복 신청', {
            description: '이미 신청된 강의입니다.',
          });
        } else if (e.code === 'INVALID_INPUT' && e.details) {
          const fieldErrors = Object.values(e.details).join('\n');
          toast.error('입력값 오류', { description: fieldErrors });
        } else {
          toast.error('수강 신청 실패', { description: e.message || '잠시 후 다시 시도해 주세요.' });
        }
      },
    });
  };

  const isGroup = form.type === EnrollmentApplicationType.GROUP;

  return (
    currentStep === step && (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>3단계: 확인 및 제출</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 선택 강의 */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">선택 강의</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(EnrollmentStep.COURSE)}
                className="cursor-pointer text-blue-600 hover:text-blue-700 h-auto p-1">
                <Edit2 className="h-3 w-3 mr-1" />
                수정
              </Button>
            </div>
            {form.selectedCourse ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{form.selectedCourse.title}</p>
                <p className="text-gray-600">{form.selectedCourse.instructor}</p>
                <p className="text-gray-600">
                  {new Date(form.selectedCourse.startDate).toLocaleDateString()} ~{' '}
                  {new Date(form.selectedCourse.endDate).toLocaleDateString()}
                </p>
                <p className="text-blue-600 font-semibold">₩{form.selectedCourse.price.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">선택된 강의가 없습니다</p>
            )}
          </div>

          {/* 신청자 정보 */}
          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">신청자 정보</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(EnrollmentStep.INFO)}
                className="cursor-pointer text-blue-600 hover:text-blue-700 h-auto p-1">
                <Edit2 className="h-3 w-3 mr-1" />
                수정
              </Button>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">신청 유형:</span> {isGroup ? '단체 신청' : '개인 신청'}
              </p>
              <p>
                <span className="font-medium">이름:</span> {form.applicant.name}
              </p>
              <p>
                <span className="font-medium">이메일:</span> {form.applicant.email}
              </p>
              <p>
                <span className="font-medium">전화:</span> {form.applicant.phone}
              </p>
              {form.applicant.motivation && (
                <p>
                  <span className="font-medium">수강 동기:</span> {form.applicant.motivation}
                </p>
              )}
            </div>
          </div>

          {/* 단체 정보 */}
          {isGroup && (
            <div className="space-y-2 bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">단체 정보</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">단체명:</span> {form.group.organizationName}
                </p>
                <p>
                  <span className="font-medium">신청 인원:</span> {form.group.headCount}명
                </p>
                <p>
                  <span className="font-medium">담당자 연락처:</span> {form.group.contactPerson}
                </p>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-700">참가자 명단</p>
                {form.group.participants.map((p, i) => (
                  <div key={i} className="text-sm text-gray-600 flex gap-2">
                    <span>{i + 1}.</span>
                    <span>{p.name}</span>
                    <span className="text-gray-400">({p.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이용약관 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={form.agreedToTerms}
                onCheckedChange={checked => {
                  setForm({ agreedToTerms: checked as boolean });
                  if (checked) setTermsError(null);
                }}
              />
              <Label htmlFor="terms" className="cursor-pointer text-sm">
                이용약관에 동의합니다
              </Label>
            </div>
            {termsError && <p className="text-sm text-red-600">{termsError}</p>}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBackStepClick} className="flex-1">
              이전
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="flex-1 bg-green-600 hover:bg-green-700">
              {isPending ? '신청 중...' : '신청 완료'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default ConfirmEnrollmentStep;

interface ConfirmEnrollmentStepProps {
  step: EnrollmentStep;
  onNextStepClick: () => void;
  onBackStepClick: () => void;
}
