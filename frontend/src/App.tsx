import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { useJourney } from './context/journey-context';
import { EnrollmentForm } from './features/enrollment/EnrollmentForm';
import { OffersPage } from './features/offers/OffersPage';
import { SuccessPage } from './features/success/SuccessPage';

export function App() {
  const { step } = useJourney();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {step === 'OFFERS' && <OffersPage />}
        {step === 'FORM' && <EnrollmentForm />}
        {step === 'SUCCESS' && <SuccessPage />}
      </main>
      <Footer />
    </div>
  );
}
