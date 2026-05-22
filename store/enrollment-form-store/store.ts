import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EnrollmentStep, EnrollmentApplicationType } from './constant';
import { EnrollmentFormStoreAction, EnrollmentFormStoreState } from './type';

const defaultStep: EnrollmentFormStoreState['currentStep'] = EnrollmentStep.LECTURE;
const defaultForm: EnrollmentFormStoreState['form'] = {
  selectedLecture: null,
  applicationType: EnrollmentApplicationType.INDIVIDUAL,
  name: '',
  email: '',
  phone: '',
  motivation: '',
  groupName: '',
  groupSize: 2,
  participants: [{ name: '', email: '' }],
  managerPhone: '',
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
