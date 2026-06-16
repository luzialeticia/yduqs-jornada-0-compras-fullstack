import type { CreateEnrollmentPayload, EnrollmentResponse } from '../types';
import { apiFetch } from './client';

export function createEnrollment(
  payload: CreateEnrollmentPayload,
): Promise<EnrollmentResponse> {
  return apiFetch<EnrollmentResponse>('/enrollments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
