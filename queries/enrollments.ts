import { EnrollmentRequest, EnrollmentResponse } from '@/mock/enrollments';
import { getBaseUrl } from '@/lib/get-api-url';
import { useMutation } from '@tanstack/react-query';

export const submitEnrollment = async (body: EnrollmentRequest): Promise<EnrollmentResponse> => {
  const res = await fetch(`${getBaseUrl()}/api/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return res.json();
};

export const useSubmitEnrollmentMutation = () =>
  useMutation<EnrollmentResponse, Error, EnrollmentRequest>({
    mutationFn: submitEnrollment,
  });
