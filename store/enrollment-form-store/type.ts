import { EnrollmentApplicationType, EnrollmentStep } from './constant';
import { Course } from '@/mock/courses';

export type EnrollmentFormStoreState = {
  currentStep: EnrollmentStep;
  form: {
    selectedCourse: Course | null;
    applicationType: EnrollmentApplicationType;
    name: string;
    email: string;
    phone: string;
    motivation: string;
    groupName: string;
    groupSize: number;
    participants: {
      name: string;
      email: string;
    }[];
    managerPhone: string;
    agreedToTerms: boolean;
  };
};

export type EnrollmentFormStoreAction = {
  setStep: (currentStep: EnrollmentFormStoreState['currentStep']) => void;
  setForm: (form: Partial<EnrollmentFormStoreState['form']>) => void;
};
