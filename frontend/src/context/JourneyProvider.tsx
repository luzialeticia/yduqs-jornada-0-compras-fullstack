import { useReducer, type ReactNode } from 'react';
import type { EnrollmentResponse, Installment, Offer } from '../types';
import {
  JourneyContext,
  type JourneyState,
} from './journey-context';

type Action =
  | { type: 'SELECT_OFFER'; offer: Offer; installment?: Installment }
  | { type: 'COMPLETE'; enrollment: EnrollmentResponse }
  | { type: 'RESET' };

const initialState: JourneyState = { step: 'OFFERS' };

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'SELECT_OFFER':
      return {
        ...state,
        step: 'FORM',
        offer: action.offer,
        installment: action.installment,
      };
    case 'COMPLETE':
      return { ...state, step: 'SUCCESS', enrollment: action.enrollment };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    ...state,
    selectOffer: (offer: Offer, installment?: Installment) =>
      dispatch({ type: 'SELECT_OFFER', offer, installment }),
    completeEnrollment: (enrollment: EnrollmentResponse) =>
      dispatch({ type: 'COMPLETE', enrollment }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}
