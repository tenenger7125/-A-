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
    formState: { errors },
  } = useForm<EnrollInfoFormValues>({
    resolver: zodResolver(enrollInfoSchema),
    defaultValues: storeForm,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const patientFieldArray = useFieldArray({ control, name: 'participants' });
  const { replace: patientFieldArrayReplace } = patientFieldArray;

  const formValues = useWatch({ control }) as EnrollInfoFormValues;
  const motivation = formValues.motivation;
  const isGroup = formValues.applicationType === EnrollmentApplicationType.GROUP;

  const addParticipant = () => {
    if (patientFieldArray.fields.length >= 10) return;
    patientFieldArray.append({ name: '', email: '' });
    setValue('groupSize', patientFieldArray.fields.length + 1);
  };

  const removeParticipant = (index: number) => {
    if (patientFieldArray.fields.length <= 2) return;
    patientFieldArray.remove(index);
    setValue('groupSize', patientFieldArray.fields.length - 1);
  };

  const handleGroupSizeChange = (raw: number) => {
    const size = Math.min(10, Math.max(2, raw || 2));
    if (size > patientFieldArray.fields.length) {
      patientFieldArray.append(
        Array.from({ length: size - patientFieldArray.fields.length }, () => ({ name: '', email: '' })),
      );
    } else if (size < patientFieldArray.fields.length) {
      patientFieldArray.replace(
        patientFieldArray.fields.slice(0, size).map(f => ({ name: f.name ?? '', email: f.email ?? '' })),
      );
    }
    setValue('groupSize', size);
  };

  const onSubmit = () => {
    onNextStepClick();
  };

  useEffect(() => {
    setValue('applicationType', storeForm.applicationType);

    if (storeForm.applicationType === EnrollmentApplicationType.INDIVIDUAL) {
      setValue('groupName', '');
      setValue('groupSize', 2);
      setValue('managerPhone', '');
      patientFieldArrayReplace([
        { name: '', email: '' },
        { name: '', email: '' },
      ]);
    }
  }, [storeForm.applicationType, setValue, patientFieldArrayReplace]);

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
                  {...register('name')}
                  placeholder="홍길동"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="user@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">전화번호 * (예: 010-1234-5678)</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="010-1234-5678"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="motivation">수강 동기 (선택)</Label>
                <Textarea
                  id="motivation"
                  {...register('motivation')}
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
                  <Label htmlFor="groupName">단체명 *</Label>
                  <Input
                    id="groupName"
                    {...register('groupName')}
                    placeholder="회사명 / 팀명"
                    className={errors.groupName ? 'border-red-500' : ''}
                  />
                  {errors.groupName && <p className="text-sm text-red-600 mt-1">{errors.groupName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="groupSize">신청 인원수 * (2~10명)</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    min="2"
                    max="10"
                    value={patientFieldArray.fields.length}
                    onChange={e => handleGroupSizeChange(parseInt(e.target.value))}
                    className={errors.groupSize ? 'border-red-500' : ''}
                  />
                  {errors.groupSize && <p className="text-sm text-red-600 mt-1">{errors.groupSize.message}</p>}
                </div>

                <div>
                  <Label>참가자 명단 *</Label>
                  <div className="space-y-3 mt-3">
                    {patientFieldArray.fields.map((field, i) => (
                      <div key={field.id} className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="이름"
                              {...register(`participants.${i}.name`)}
                              className={errors.participants?.[i]?.name ? 'border-red-500' : ''}
                            />
                            {errors.participants?.[i]?.name && (
                              <p className="text-sm text-red-600 mt-1">{errors.participants[i].name.message}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="이메일"
                              type="email"
                              {...register(`participants.${i}.email`)}
                              className={errors.participants?.[i]?.email ? 'border-red-500' : ''}
                            />
                            {errors.participants?.[i]?.email && (
                              <p className="text-sm text-red-600 mt-1">{errors.participants[i].email.message}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParticipant(i)}
                            disabled={patientFieldArray.fields.length <= 2}>
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
                      disabled={patientFieldArray.fields.length >= 10}
                      className="w-full">
                      참가자 추가
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="managerPhone">담당자 연락처 * (010-1234-5678)</Label>
                  <Input
                    id="managerPhone"
                    {...register('managerPhone')}
                    placeholder="010-1234-5678"
                    className={errors.managerPhone ? 'border-red-500' : ''}
                  />
                  {errors.managerPhone && <p className="text-sm text-red-600 mt-1">{errors.managerPhone.message}</p>}
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
