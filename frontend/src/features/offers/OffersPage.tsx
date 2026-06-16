import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import type { Offer } from '../../types';
import { InstallmentsDialog } from './InstallmentsDialog';
import { OfferCard } from './OfferCard';
import { useOffers } from './useOffers';

export function OffersPage() {
  const { offers, loading, error, reload } = useOffers();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  return (
    <section>
      <div className="bg-brand-bright text-primary-foreground">
        <div className="container py-8 md:py-10">
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Vamos começar, escolha as opções do seu curso
          </h1>
          <p className="mt-1 text-primary-foreground/90">
            Use os filtros para saber o preço do seu curso e fazer sua
            inscrição.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {!loading && !error && offers.length > 0 && (
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            {offers.length}{' '}
            {offers.length === 1 ? 'opção encontrada' : 'opções encontradas'}
          </p>
        )}

        {loading && (
        <div
          className="flex items-center gap-3 py-16 text-muted-foreground"
          role="status"
        >
          <Spinner /> Carregando ofertas...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p className="mb-3 font-medium text-destructive">{error}</p>
          <Button variant="outline" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!loading && !error && offers.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          Nenhuma oferta disponível no momento.
        </p>
      )}

      {!loading && !error && offers.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onAdvance={setSelectedOffer}
            />
          ))}
        </div>
      )}

        <InstallmentsDialog
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      </div>
    </section>
  );
}
