import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  JourneyContext,
  type JourneyContextValue,
} from '../../context/journey-context';
import { mockOffer } from '../../test/mocks';
import { EnrollmentForm } from './EnrollmentForm';

const createEnrollment = vi.fn();
vi.mock('../../api/enrollments', () => ({
  createEnrollment: (payload: unknown) => createEnrollment(payload),
}));

const completeEnrollment = vi.fn();

function renderForm() {
  const value: JourneyContextValue = {
    step: 'FORM',
    offer: mockOffer,
    installment: mockOffer.installments[1],
    selectOffer: vi.fn(),
    completeEnrollment,
    reset: vi.fn(),
  };
  return render(
    <JourneyContext.Provider value={value}>
      <EnrollmentForm />
    </JourneyContext.Provider>,
  );
}

afterEach(() => vi.clearAllMocks());

describe('EnrollmentForm', () => {
  it('mantém Avançar desabilitado até o formulário ficar válido', async () => {
    renderForm();
    const button = screen.getByRole('button', { name: /avançar/i });

    expect(button).toBeDisabled();

    await userEvent.type(
      screen.getByLabelText('Nome completo'),
      'Maria da Silva',
    );
    await userEvent.type(screen.getByLabelText('CPF'), '52998224725');
    fireEvent.change(screen.getByLabelText('Data de nascimento'), {
      target: { value: '2000-05-20' },
    });
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@email.com');
    await userEvent.type(
      screen.getByLabelText('Celular para contato'),
      '21999998888',
    );
    expect(button).toBeDisabled();

    await userEvent.click(screen.getByLabelText('Aceito os termos de uso'));

    expect(button).toBeEnabled();
  });

  it('envia a matrícula com dados válidos e sanitizados', async () => {
    createEnrollment.mockResolvedValue({
      id: 'enroll-1',
      fullName: 'Maria da Silva',
      status: 'PENDING',
    });
    renderForm();

    await userEvent.type(
      screen.getByLabelText('Nome completo'),
      'Maria da Silva',
    );
    await userEvent.type(screen.getByLabelText('CPF'), '52998224725');
    fireEvent.change(screen.getByLabelText('Data de nascimento'), {
      target: { value: '2000-05-20' },
    });
    await userEvent.type(
      screen.getByLabelText('E-mail'),
      'maria@email.com',
    );
    await userEvent.type(
      screen.getByLabelText('Celular para contato'),
      '21999998888',
    );
    await userEvent.click(screen.getByLabelText('Aceito os termos de uso'));

    await userEvent.click(screen.getByRole('button', { name: /avançar/i }));

    await waitFor(() => expect(createEnrollment).toHaveBeenCalledTimes(1));
    expect(createEnrollment).toHaveBeenCalledWith(
      expect.objectContaining({
        offerId: mockOffer.id,
        installmentId: mockOffer.installments[1].id,
        cpf: '52998224725',
        phone: '21999998888',
        email: 'maria@email.com',
        acceptedTerms: true,
      }),
    );
    await waitFor(() => expect(completeEnrollment).toHaveBeenCalledTimes(1));
  });
});
