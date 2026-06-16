import { Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { formatCurrency, modalityLabel, shiftLabel } from '../../lib/format';
import type { Offer } from '../../types';

interface OfferCardProps {
  offer: Offer;
  onAdvance: (offer: Offer) => void;
}

export function OfferCard({ offer, onAdvance }: OfferCardProps) {
  const maxInstallment = offer.installments.reduce(
    (max, current) => (current.count > max.count ? current : max),
    offer.installments[0],
  );

  return (
    <Card className="flex flex-col overflow-hidden border-2 border-brand/15">
      <div className="flex flex-1 flex-col bg-brand text-primary-foreground">
        <div className="flex items-center gap-2 bg-brand-dark px-5 py-3">
          <span className="font-semibold">{modalityLabel[offer.modality]}</span>
          {offer.shift && (
            <>
              <span aria-hidden className="opacity-50">
                |
              </span>
              <span className="opacity-90">{shiftLabel[offer.shift]}</span>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 py-5">
          <h3 className="text-base font-bold leading-tight">
            {offer.courseName}
          </h3>

          {offer.priceOnRequest ? (
            <div className="mt-auto flex items-start gap-2 text-sm text-primary-foreground/90">
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <span>
                Inscreva-se para saber tudo sobre os valores e garantir a sua
                vaga!
              </span>
            </div>
          ) : (
            <div className="mt-auto">
              <p className="text-sm text-primary-foreground/70">
                De{' '}
                <span className="line-through">
                  {formatCurrency(offer.originalPrice ?? 0)}
                </span>{' '}
                por até
              </p>
              <p className="leading-tight">
                {maxInstallment && (
                  <span className="text-base font-semibold">
                    {maxInstallment.count}x{' '}
                  </span>
                )}
                <span className="text-3xl font-extrabold">
                  {formatCurrency(offer.discountPrice ?? 0)}
                </span>
              </p>
              {offer.cashPrice != null && (
                <p className="mt-1 text-xs text-primary-foreground/70">
                  à vista {formatCurrency(offer.cashPrice)}
                </p>
              )}
            </div>
          )}

          <Button
            variant="accent"
            className="w-full"
            onClick={() => onAdvance(offer)}
            aria-label={`Avançar com ${offer.courseName} (${modalityLabel[offer.modality]})`}
          >
            Avançar
          </Button>
        </div>
      </div>

      {offer.campusName && (
        <div className="bg-white px-5 py-4 text-xs leading-relaxed">
          <p className="font-bold uppercase text-foreground">
            {offer.campusName}
          </p>
          {offer.campusAddress && (
            <p className="uppercase text-muted-foreground">
              {offer.campusAddress}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
