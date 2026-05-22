'use client';

import { Fragment } from 'react/jsx-runtime';
import { enrollmentFormStore, type EnrollmentFormStoreState } from '@/store/enrollment-form-store';

const ProgressBar = ({ values }: ProgressBarProps) => {
  const { currentStep, setStep } = enrollmentFormStore();

  return (
    <div className="flex items-center justify-between mb-8">
      {values.map((s, i) => (
        <Fragment key={s}>
          <button
            onClick={() => setStep(s)}
            disabled={values.indexOf(currentStep) < i}
            className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
              currentStep === s
                ? 'bg-blue-600 text-white scale-110'
                : values.indexOf(currentStep) > i
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}>
            {values.indexOf(currentStep) > i ? '✓' : i + 1}
          </button>
          {i < values.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 transition-all ${values.indexOf(currentStep) > i ? 'bg-green-600' : 'bg-gray-200'}`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;

interface ProgressBarProps {
  values: EnrollmentFormStoreState['currentStep'][];
}
