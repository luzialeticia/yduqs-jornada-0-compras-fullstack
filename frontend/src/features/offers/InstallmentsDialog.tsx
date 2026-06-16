import { Info, Minus, Plus } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { useJourney } from '../../context/journey-context';
import { cn } from '../../lib/utils';
import { formatCurrency, modalityLabel, shiftLabel } from '../../lib/format';
import type { Offer } from '../../types';

interface InstallmentsDialogProps {
  offer: Offer | null;
  onClose: () => void;
}

export function InstallmentsDialog({ offer, onClose }: InstallmentsDialogProps) {
  const { selectOffer } = useJourney();
  const [installmentId, setInstallmentId] = useState('');

  useEffect(() => {
    setInstallmentId(offer?.installments[0]?.id ?? '');
  }, [offer]);

  const handleAdvance = () => {
    if (!offer) return;
    if (offer.priceOnRequest) {
      selectOffer(offer);
      return;
    }
    const installment = offer.installments.find((i) => i.id === installmentId);
    if (installment) selectOffer(offer, installment);
  };

  return (
    <Dialog
      open={!!offer}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {offer && (
        <DialogContent className="left-auto right-4 max-w-md translate-x-0 sm:right-8">
          <div className="px-6 pb-2 pt-6">
            <DialogTitle className="text-lg font-bold text-foreground">
              Mais detalhes
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {offer.priceOnRequest ? (
              <DialogDescription className="-mx-6 mb-4 flex items-start gap-2 bg-brand-bright px-6 py-4 text-sm text-primary-foreground">
                <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <span>
                  Inscreva-se para saber tudo sobre os valores e garantir a sua
                  vaga!
                </span>
              </DialogDescription>
            ) : (
              <>
                <DialogDescription className="mb-3 font-medium text-foreground">
                  Qual dessas opções de parcelas você prefere?
                </DialogDescription>

                <RadioGroup
                  value={installmentId}
                  onValueChange={setInstallmentId}
                  className="gap-0 overflow-hidden rounded-lg border"
                >
                  <div className="grid grid-cols-[1fr_auto] gap-4 bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                    <span>Parcelas</span>
                    <span>Total</span>
                  </div>
                  {offer.installments.map((installment) => (
                    <Label
                      key={installment.id}
                      htmlFor={installment.id}
                      className="grid cursor-pointer grid-cols-[1fr_auto] items-center gap-4 border-t px-4 py-3 text-sm has-[:checked]:bg-brand/5"
                    >
                      <span className="flex items-center gap-3 font-medium">
                        <RadioGroupItem
                          id={installment.id}
                          value={installment.id}
                        />
                        {installment.count}x de{' '}
                        {formatCurrency(installment.amount)}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(installment.amount * installment.count)}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </>
            )}

            <Disclosure title="Sobre a Bolsa Incentivo">
              Desconto promocional já aplicado nos valores acima, sujeito às
              condições do edital e à disponibilidade de vagas.
            </Disclosure>

            <Disclosure title="Resumo das suas escolhas">
              <p className="font-medium text-foreground">{offer.courseName}</p>
              <p>
                {modalityLabel[offer.modality]}
                {offer.shift ? ` · ${shiftLabel[offer.shift]}` : ''}
              </p>
            </Disclosure>
          </div>

          <div className="border-t p-4">
            <Button
              variant="accent"
              className="w-full"
              disabled={!offer.priceOnRequest && !installmentId}
              onClick={handleAdvance}
            >
              Avançar
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function Disclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
      >
        {title}
        {open ? (
          <Minus className="h-4 w-4" aria-hidden />
        ) : (
          <Plus className="h-4 w-4" aria-hidden />
        )}
      </button>
      <div className={cn('pb-3 text-sm text-muted-foreground', !open && 'hidden')}>
        {children}
      </div>
    </div>
  );
}
