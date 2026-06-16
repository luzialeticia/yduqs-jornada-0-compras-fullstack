import { useState, type FormEvent, type ReactNode } from 'react';
import { ApiError } from '../../api/client';
import { createEnrollment } from '../../api/enrollments';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Spinner } from '../../components/ui/spinner';
import { useJourney } from '../../context/journey-context';
import { maskCpf, maskPhone } from '../../lib/format';
import {
  isValidBirthDate,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  onlyDigits,
} from '../../lib/validation';

interface FormState {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  completionYear: string;
  acceptedTerms: boolean;
  acceptedWhatsapp: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  fullName: '',
  cpf: '',
  birthDate: '',
  email: '',
  phone: '',
  completionYear: '',
  acceptedTerms: false,
  acceptedWhatsapp: false,
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.fullName.trim().length < 3)
    errors.fullName = 'Informe seu nome completo.';
  if (!isValidCpf(form.cpf)) errors.cpf = 'CPF inválido.';
  if (!isValidBirthDate(form.birthDate))
    errors.birthDate = 'Data de nascimento inválida.';
  if (!isValidEmail(form.email)) errors.email = 'E-mail inválido.';
  if (!isValidPhone(form.phone)) errors.phone = 'Telefone inválido (com DDD).';
  if (!form.acceptedTerms)
    errors.acceptedTerms = 'É necessário aceitar os termos.';
  return errors;
}

export function EnrollmentForm() {
  const { offer, installment, completeEnrollment } = useJourney();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!offer) return null;

  const isFormValid = Object.keys(validate(form)).length === 0;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleBlur = (field: keyof FormState) => {
    setErrors((prev) => ({ ...prev, [field]: validate(form)[field] }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const enrollment = await createEnrollment({
        offerId: offer.id,
        installmentId: installment?.id,
        fullName: form.fullName.trim(),
        cpf: onlyDigits(form.cpf),
        birthDate: form.birthDate,
        email: form.email.trim(),
        phone: onlyDigits(form.phone),
        highSchoolCompletionYear: form.completionYear
          ? Number(form.completionYear)
          : undefined,
        acceptedTerms: form.acceptedTerms,
        acceptedWhatsapp: form.acceptedWhatsapp,
      });
      completeEnrollment(enrollment);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? (err.details?.join(' ') ?? err.message)
          : 'Não foi possível concluir a matrícula. Tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="bg-brand-bright text-primary-foreground">
        <div className="container py-8 md:py-10">
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Queremos saber um pouco mais sobre você
          </h1>
        </div>
      </div>

      <div className="container max-w-2xl py-8">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <Field
            label="Nome completo"
            htmlFor="fullName"
            error={errors.fullName}
            helper="Preencha seu nome completo, sem abreviações, igual ao seu documento de identificação."
          >
            <Input
              id="fullName"
              placeholder="Nome completo"
              value={form.fullName}
              hasError={!!errors.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
            />
          </Field>

          <Field label="CPF" htmlFor="cpf" error={errors.cpf}>
            <Input
              id="cpf"
              inputMode="numeric"
              placeholder="CPF"
              value={form.cpf}
              hasError={!!errors.cpf}
              onChange={(e) => setField('cpf', maskCpf(e.target.value))}
              onBlur={() => handleBlur('cpf')}
            />
          </Field>

          <Field
            label="Data de nascimento"
            htmlFor="birthDate"
            error={errors.birthDate}
          >
            {/*
              Começa como type="text" para exibir "Data de nascimento" como
              placeholder (igual ao handoff) e vira type="date" no foco para
              abrir o seletor nativo; volta a text se ficar vazio.
            */}
            <Input
              id="birthDate"
              type="text"
              placeholder="Data de nascimento"
              value={form.birthDate}
              hasError={!!errors.birthDate}
              onFocus={(e) => (e.currentTarget.type = 'date')}
              onBlur={(e) => {
                if (!e.currentTarget.value) e.currentTarget.type = 'text';
                handleBlur('birthDate');
              }}
              onChange={(e) => setField('birthDate', e.target.value)}
            />
          </Field>

          <Field label="E-mail" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              hasError={!!errors.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
          </Field>

          <Field
            label="Celular para contato"
            htmlFor="phone"
            error={errors.phone}
          >
            <Input
              id="phone"
              inputMode="numeric"
              placeholder="Celular para contato"
              value={form.phone}
              hasError={!!errors.phone}
              onChange={(e) => setField('phone', maskPhone(e.target.value))}
              onBlur={() => handleBlur('phone')}
            />
          </Field>

          <Field label="Ano de conclusão do ensino médio" htmlFor="completionYear">
            <Input
              id="completionYear"
              inputMode="numeric"
              maxLength={4}
              placeholder="Ano de conclusão do ensino médio"
              value={form.completionYear}
              onChange={(e) =>
                setField('completionYear', onlyDigits(e.target.value).slice(0, 4))
              }
            />
          </Field>

          <div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={form.acceptedTerms}
                onCheckedChange={(checked) =>
                  setField('acceptedTerms', checked === true)
                }
                aria-label="Aceito os termos de uso"
              />
              <span>
                Li e concordo com os{' '}
                <a href="#" className="text-brand underline">
                  termos do edital
                </a>
                , bem como com o tratamento dos meus dados para fins de
                prospecção dos serviços educacionais prestados pela Estácio e
                demais instituições de ensino do mesmo Grupo Econômico, de
                acordo com a nossa{' '}
                <a href="#" className="text-brand underline">
                  política de privacidade
                </a>
                .
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.acceptedTerms}
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox
              checked={form.acceptedWhatsapp}
              onCheckedChange={(checked) =>
                setField('acceptedWhatsapp', checked === true)
              }
              aria-label="Aceito receber novidades pelo WhatsApp"
            />
            <span>
              Aceito receber atualizações sobre minha inscrição pelo WhatsApp.
            </span>
          </label>

          {submitError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {submitError}
            </p>
          )}

          <div className="mt-2 flex justify-end sm:justify-start">
            <Button
              type="submit"
              variant="accent"
              disabled={submitting || !isFormValid}
            >
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4" /> Enviando...
                </>
              ) : (
                'Avançar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  helper,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={htmlFor} className="sr-only">
        {label}
      </Label>
      {children}
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
