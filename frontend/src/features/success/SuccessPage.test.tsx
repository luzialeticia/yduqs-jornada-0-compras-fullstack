import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  JourneyContext,
  type JourneyContextValue,
} from '../../context/journey-context';
import { mockOffer } from '../../test/mocks';
import { SuccessPage } from './SuccessPage';

function renderSuccess(reset = vi.fn()) {
  const value: JourneyContextValue = {
    step: 'SUCCESS',
    offer: mockOffer,
    installment: mockOffer.installments[1],
    enrollment: {
      id: 'enroll-123',
      offerId: mockOffer.id,
      installmentId: mockOffer.installments[1].id,
      fullName: 'Maria da Silva',
      cpf: '***.982.247-**',
      email: 'maria@email.com',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    },
    selectOffer: vi.fn(),
    completeEnrollment: vi.fn(),
    reset,
  };
  return render(
    <JourneyContext.Provider value={value}>
      <SuccessPage />
    </JourneyContext.Provider>,
  );
}

describe('SuccessPage', () => {
  it('mostra a confirmação com protocolo e nome', () => {
    renderSuccess();

    expect(screen.getByText('Matrícula realizada!')).toBeInTheDocument();
    expect(screen.getByText('enroll-123')).toBeInTheDocument();
    expect(screen.getByText('Maria da Silva')).toBeInTheDocument();
  });

  it('reinicia a jornada ao clicar em nova matrícula', async () => {
    const reset = vi.fn();
    renderSuccess(reset);

    await userEvent.click(
      screen.getByRole('button', { name: /nova matrícula/i }),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
