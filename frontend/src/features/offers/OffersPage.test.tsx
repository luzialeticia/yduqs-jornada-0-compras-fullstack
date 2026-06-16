import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JourneyProvider } from '../../context/JourneyProvider';
import { mockOffer, mockTapumeOffer } from '../../test/mocks';
import { OffersPage } from './OffersPage';

const getOffers = vi.fn();
vi.mock('../../api/offers', () => ({
  getOffers: () => getOffers(),
}));

function renderPage() {
  return render(
    <JourneyProvider>
      <OffersPage />
    </JourneyProvider>,
  );
}

afterEach(() => vi.clearAllMocks());

describe('OffersPage', () => {
  it('mostra loading e depois as ofertas', async () => {
    getOffers.mockResolvedValue([mockOffer]);
    renderPage();

    expect(screen.getByText(/carregando ofertas/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText('Análise e Desenvolvimento de Sistemas'),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText('R$ 169,95')).toBeInTheDocument();
  });

  it('mostra erro e permite tentar novamente', async () => {
    getOffers.mockRejectedValueOnce(new Error('falha'));
    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText(/não foi possível carregar as ofertas/i),
      ).toBeInTheDocument(),
    );

    getOffers.mockResolvedValueOnce([mockOffer]);
    await userEvent.click(
      screen.getByRole('button', { name: /tentar novamente/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText('Análise e Desenvolvimento de Sistemas'),
      ).toBeInTheDocument(),
    );
  });

  it('abre o modal de parcelas ao avançar', async () => {
    getOffers.mockResolvedValue([mockOffer]);
    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText('Análise e Desenvolvimento de Sistemas'),
      ).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole('button', { name: /avançar/i }));

    expect(
      await screen.findByText(/mais detalhes/i),
    ).toBeInTheDocument();
    expect(screen.getByText('12x de R$ 169,95')).toBeInTheDocument();
  });

  it('oferta sem preço (tapume) mostra convite e modal sem parcelas', async () => {
    getOffers.mockResolvedValue([mockTapumeOffer]);
    renderPage();

    await waitFor(() =>
      expect(screen.getByText('Engenharia de Software')).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/inscreva-se para saber tudo sobre os valores/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\/mês/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /avançar/i }));

    expect(await screen.findByText(/mais detalhes/i)).toBeInTheDocument();
    expect(screen.queryByText('Parcelas')).not.toBeInTheDocument();
  });
});
