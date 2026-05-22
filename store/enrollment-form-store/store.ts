import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EnrollmentStep, EnrollmentApplicationType } from './constant';
import { EnrollmentFormStoreAction, EnrollmentFormStoreState } from './type';

const defaultStep: EnrollmentFormStoreState['currentStep'] = EnrollmentStep.COURSE;
const defaultForm: EnrollmentFormStoreState['form'] = {
  selectedCourse: null,
  type: EnrollmentApplicationType.PERSONAL,
  applicant: { name: '', email: '', phone: '', motivation: '' },
  group: {
    organizationName: '',
    headCount: 2,
    participants: [
      { name: '', email: '' },
      { name: '', email: '' },
    ],
    contactPerson: '',
  },
  agreedToTerms: false,
};

export const enrollmentFormStore = create<EnrollmentFormStoreState & EnrollmentFormStoreAction>()(
  persist(
    set => ({
      currentStep: defaultStep,
      form: defaultForm,

      setStep: currentStep => set({ currentStep }),
      setForm: form => set(state => ({ form: { ...state.form, ...form } })),
      resetStep: () => set({ currentStep: defaultStep }),
      resetForm: () => set({ form: defaultForm }),
    }),
    {
      name: 'enrollment-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
