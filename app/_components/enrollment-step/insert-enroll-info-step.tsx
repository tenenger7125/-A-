'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, Trash2 } from 'lucide-react';
import { EnrollmentApplicationType, EnrollmentStep, enrollmentFormStore } from '@/store/enrollment-form-store';
import { EnrollInfoFormValues, enrollInfoSchema } from '@/app/_schemas/enrollment-schema';

const InsertEnrollInfoStep = ({ step, onNextStepClick, onBackStepClick }: InsertEnrollInfoStepProps) => {
  const { currentStep, form: storeForm, setForm } = enrollmentFormStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<EnrollInfoFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(enrollInfoSchema as any),
    defaultValues: {
      type: storeForm.type,
      applicant: storeForm.applicant,
      group: storeForm.group,
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const participantFieldArray = useFieldArray({ control, name: 'group.participants' });
  const { replace: participantFieldArrayReplace } = participantFieldArray;

  const phoneRegister = register('applicant.phone');
  const formValues = useWatch({ control }) as EnrollInfoFormValues;
  const motivation = formValues.applicant?.motivation;
  const isGroup = formValues.type === EnrollmentApplicationType.GROUP;

  const addParticipant = () => {
    if (participantFieldArray.fields.length >= 10) return;
    participantFieldArray.append({ name: '', email: '' });
    setValue('group.headCount', participantFieldArray.fields.length + 1);
  };

  const removeParticipant = (index: number) => {
    if (participantFieldArray.fields.length <= 2) return;
    participantFieldArray.remove(index);
    setValue('group.headCount', participantFieldArray.fields.length - 1);
  };

  const handleGroupSizeChange = (raw: number) => {
    const size = Math.min(10, Math.max(2, raw || 2));
    if (size > participantFieldArray.fields.length) {
      participantFieldArray.append(
        Array.from({ length: size - participantFieldArray.fields.length }, () => ({ name: '', email: '' })),
      );
    } else if (size < participantFieldArray.fields.length) {
      participantFieldArray.replace(
        participantFieldArray.fields.slice(0, size).map(f => ({ name: f.name ?? '', email: f.email ?? '' })),
      );
    }
    setValue('group.headCount', size);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const onSubmit = () => {
    onNextStepClick();
  };

  useEffect(() => {
    setValue('type', storeForm.type);

    if (storeForm.type === EnrollmentApplicationType.PERSONAL) {
      setValue('group.organizationName', '');
      setValue('group.headCount', 2);
      setValue('group.contactPerson', '');
      participantFieldArrayReplace([
        { name: '', email: '' },
        { name: '', email: '' },
      ]);
    }
  }, [storeForm.type, setValue, participantFieldArrayReplace]);

  useEffect(() => {
    if (!isDirty || currentStep !== step) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, currentStep, step]);

  useEffect(() => {
    clearErrors();
  }, [currentStep, clearErrors]);

  useEffect(() => {
    setForm(formValues);
  }, [formValues, setForm]);

  return (
    currentStep === step && (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>2단계: 수강생 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  {...register('applicant.name')}
                  placeholder="홍길동"
                  className={errors.applicant?.name ? 'border-red-500' : ''}
                />
                {errors.applicant?.name && <p className="text-sm text-red-600 mt-1">{errors.applicant.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('applicant.email')}
                  placeholder="user@example.com"
                  className={errors.applicant?.email ? 'border-red-500' : ''}
                />
                {errors.applicant?.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.applicant.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">전화번호 * (예: 010-1234-5678)</Label>
                <Input
                  id="phone"
                  {...phoneRegister}
                  onChange={e => {
                    e.target.value = formatPhone(e.target.value);
                    phoneRegister.onChange(e);
                  }}
                  placeholder="010-1234-5678"
                  className={errors.applicant?.phone ? 'border-red-500' : ''}
                />
                {errors.applicant?.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.applicant.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="motivation">수강 동기 (선택)</Label>
                <Textarea
                  id="motivation"
                  {...register('applicant.motivation')}
                  placeholder="이 강의를 수강하고 싶은 이유를 적어주세요"
                  maxLength={300}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">{(motivation ?? '').length}/300</p>
              </div>
            </div>

            {isGroup && (
              <div className="border-t pt-6 space-y-4">
                <div>
                  <Label htmlFor="organizationName">단체명 *</Label>
                  <Input
                    id="organizationName"
                    {...register('group.organizationName')}
                    placeholder="회사명 / 팀명"
                    className={errors.group?.organizationName ? 'border-red-500' : ''}
                  />
                  {errors.group?.organizationName && (
                    <p className="text-sm text-red-600 mt-1">{errors.group.organizationName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="headCount">신청 인원수 * (2~10명)</Label>
                  <Input
                    id="headCount"
                    type="number"
                    min="2"
                    max="10"
                    value={participantFieldArray.fields.length}
                    onChange={e => handleGroupSizeChange(parseInt(e.target.value))}
                    className={errors.group?.headCount ? 'border-red-500' : ''}
                  />
                  {errors.group?.headCount && (
                    <p className="text-sm text-red-600 mt-1">{errors.group.headCount.message}</p>
                  )}
                </div>

                <div>
                  <Label>참가자 명단 *</Label>
                  <div className="space-y-3 mt-3">
                    {participantFieldArray.fields.map((field, i) => (
                      <div key={field.id} className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="이름"
                              {...register(`group.participants.${i}.name`)}
                              className={errors.group?.participants?.[i]?.name ? 'border-red-500' : ''}
                            />
                            {errors.group?.participants?.[i]?.name && (
                              <p className="text-sm text-red-600 mt-1">{errors.group.participants[i].name.message}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="이메일"
                              type="email"
                              {...register(`group.participants.${i}.email`)}
                              className={errors.group?.participants?.[i]?.email ? 'border-red-500' : ''}
                            />
                            {errors.group?.participants?.[i]?.email && (
                              <p className="text-sm text-red-600 mt-1">{errors.group.participants[i].email.message}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParticipant(i)}
                            disabled={participantFieldArray.fields.length <= 2}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addParticipant}
                      disabled={participantFieldArray.fields.length >= 10}
                      className="w-full">
                      참가자 추가
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactPerson">담당자 연락처 * (010-1234-5678)</Label>
                  <Input
                    id="contactPerson"
                    {...register('group.contactPerson')}
                    placeholder="010-1234-5678"
                    className={errors.group?.contactPerson ? 'border-red-500' : ''}
                  />
                  {errors.group?.contactPerson && (
                    <p className="text-sm text-red-600 mt-1">{errors.group.contactPerson.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBackStepClick} className="flex-1">
                이전
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                다음 단계 <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  );
};

export default InsertEnrollInfoStep;

interface InsertEnrollInfoStepProps {
  step: EnrollmentStep;
  onNextStepClick: () => void;
  onBackStepClick: () => void;
}
