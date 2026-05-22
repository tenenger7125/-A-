import { EnrollmentApplicationType } from '@/store/enrollment-form-store';

export interface PersonalEnrollmentRequest {
  courseId: string;
  type: EnrollmentApplicationType.PERSONAL;
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  agreedToTerms: boolean;
}

export interface GroupEnrollmentRequest {
  courseId: string;
  type: EnrollmentApplicationType.GROUP;
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  group: {
    organizationName: string;
    headCount: number;
    participants: Array<{ name: string; email: string }>;
    contactPerson: string;
  };
  agreedToTerms: boolean;
}

export type EnrollmentRequest = PersonalEnrollmentRequest | GroupEnrollmentRequest;

export interface EnrollmentResponse {
  enrollmentId: string;
  status: 'confirmed' | 'pending';
  enrolledAt: string;
}

export type EnrollmentErrorCode = 'COURSE_FULL' | 'DUPLICATE_ENROLLMENT' | 'INVALID_INPUT';

export interface ErrorResponse {
  code: EnrollmentErrorCode;
  message: string;
  details?: Record<string, string>;
}

export class EnrollmentApiError extends Error {
  code: EnrollmentErrorCode;
  details?: Record<string, string>;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.code = response.code;
    this.details = response.details;
  }
}
