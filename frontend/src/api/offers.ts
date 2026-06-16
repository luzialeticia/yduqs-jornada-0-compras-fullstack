import type { Offer } from '../types';
import { apiFetch } from './client';

export function getOffers(): Promise<Offer[]> {
  return apiFetch<Offer[]>('/offers');
}
