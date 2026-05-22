import { z } from 'zod';
import { EnrollmentApplicationType } from '@/store/enrollment-form-store';

export const PHONE_REGEX = /^\d{3}-\d{3,4}-\d{4}$/;

export const enrollInfoSchema = z
  .object({
    applicationType: z.nativeEnum(EnrollmentApplicationType),
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
    phone: z.string().regex(PHONE_REGEX, '010-1234-5678 형식으로 입력해주세요'),
    motivation: z.string().max(300),
    groupName: z.string(),
    groupSize: z.coerce.number().int(),
    participants: z.array(
      z.object({
        name: z.string(),
        email: z.string(),
      }),
    ),
    managerPhone: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.applicationType !== EnrollmentApplicationType.GROUP) return;

    if (!data.groupName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: '단체명을 입력해주세요', path: ['groupName'] });
    }

    const count = data.participants?.length ?? 0;
    if (count < 2 || count > 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: '2~10명 사이로 입력해주세요', path: ['groupSize'] });
    }

    data.participants?.forEach((p, i) => {
      if (!p.name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '이름을 입력해주세요',
          path: ['participants', i, 'name'],
        });
      }
      if (!p.email?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '이메일을 입력해주세요',
          path: ['participants', i, 'email'],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 이메일 형식이 아닙니다',
          path: ['participants', i, 'email'],
        });
      }
    });

    const emails = data.participants.map(p => p.email.trim().toLowerCase());
    emails.forEach((email, i) => {
      if (email && emails.indexOf(email) !== i) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '중복된 이메일입니다',
          path: ['participants', i, 'email'],
        });
      }
    });

    if (!data.managerPhone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '담당자 연락처를 입력해주세요',
        path: ['managerPhone'],
      });
    } else if (!PHONE_REGEX.test(data.managerPhone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '010-1234-5678 형식으로 입력해주세요',
        path: ['managerPhone'],
      });
    }
  });

export type EnrollInfoFormValues = z.infer<typeof enrollInfoSchema>;
