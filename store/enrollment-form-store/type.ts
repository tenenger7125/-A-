import { EnrollmentApplicationType, EnrollmentStep } from './constant';
import { Course } from '@/mock/courses';

export interface EnrollmentFormStoreState {
  currentStep: EnrollmentStep;
  form: {
    selectedCourse: Course | null;
    type: EnrollmentApplicationType;
    applicant: {
      name: string;
      email: string;
      phone: string;
      motivation: string;
    };
    group: {
      organizationName: string;
      headCount: number;
      participants: { name: string; email: string }[];
      contactPerson: string;
    };
    agreedToTerms: boolean;
  };
}

export interface EnrollmentFormStoreAction {
  setStep: (currentStep: EnrollmentFormStoreState['currentStep']) => void;
  setForm: (form: Partial<EnrollmentFormStoreState['form']>) => void;
  resetStep: () => void;
  resetForm: () => void;
}
