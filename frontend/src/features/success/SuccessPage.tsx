import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useJourney } from '../../context/journey-context';

export function SuccessPage() {
  const { enrollment, offer, reset } = useJourney();

  if (!enrollment) return null;

  return (
    <section className="mx-auto max-w-lg px-4 py-10 text-center">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <CheckCircle2 className="h-16 w-16 text-brand" aria-hidden />
          <h1 className="text-2xl font-bold">Matrícula realizada!</h1>
          <p className="text-muted-foreground">
            Olá, <strong>{enrollment.fullName}</strong>. Recebemos a sua
            solicitação{offer ? ` para ${offer.courseName}` : ''} e em breve
            entraremos em contato.
          </p>

          <dl className="w-full rounded-md bg-secondary p-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Protocolo</dt>
              <dd className="font-mono font-medium">{enrollment.id}</dd>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <dt className="text-muted-foreground">Situação</dt>
              <dd className="font-medium">Em análise</dd>
            </div>
          </dl>

          <Button onClick={reset} className="mt-2">
            Fazer nova matrícula
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
