import { createContext, useContext } from 'react';
import type { EnrollmentResponse, Installment, Offer } from '../types';

export type JourneyStep = 'OFFERS' | 'FORM' | 'SUCCESS';

export interface JourneyState {
  step: JourneyStep;
  offer?: Offer;
  installment?: Installment;
  enrollment?: EnrollmentResponse;
}

export interface JourneyContextValue extends JourneyState {
  selectOffer: (offer: Offer, installment?: Installment) => void;
  completeEnrollment: (enrollment: EnrollmentResponse) => void;
  reset: () => void;
}

export const JourneyContext = createContext<JourneyContextValue | null>(null);

export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney deve ser usado dentro de um JourneyProvider');
  }
  return context;
}
