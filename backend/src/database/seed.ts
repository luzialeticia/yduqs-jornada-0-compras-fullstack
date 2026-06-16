import { Modality, Shift } from '../common/enums';
import { Installment } from '../offers/entities/installment.entity';
import { Offer } from '../offers/entities/offer.entity';
import { AppDataSource } from './data-source';

async function seed() {
  await AppDataSource.initialize();

  const offerRepo = AppDataSource.getRepository(Offer);

  await AppDataSource.query(
    'TRUNCATE TABLE "enrollments", "installments", "offers" RESTART IDENTITY CASCADE',
  );

  const offers: Array<Partial<Offer>> = [
    {
      courseName: 'Análise e Desenvolvimento de Sistemas',
      modality: Modality.PRESENCIAL,
      shift: Shift.MANHA,
      originalPrice: 339.9,
      discountPrice: 169.95,
      installments: [
        { count: 1, amount: 169.95 },
        { count: 6, amount: 169.95 },
        { count: 12, amount: 169.95 },
        { count: 18, amount: 169.95 },
      ] as Installment[],
    },
    {
      courseName: 'Análise e Desenvolvimento de Sistemas',
      modality: Modality.DIGITAL,
      shift: null,
      originalPrice: 259.9,
      discountPrice: 129.95,
      installments: [
        { count: 1, amount: 129.95 },
        { count: 6, amount: 129.95 },
        { count: 12, amount: 129.95 },
      ] as Installment[],
    },
    {
      courseName: 'Administração',
      modality: Modality.PRESENCIAL,
      shift: Shift.NOITE,
      originalPrice: 299.9,
      discountPrice: 149.95,
      installments: [
        { count: 1, amount: 149.95 },
        { count: 12, amount: 149.95 },
        { count: 24, amount: 149.95 },
      ] as Installment[],
    },
    {
      courseName: 'Pedagogia',
      modality: Modality.EAD,
      shift: null,
      originalPrice: 199.9,
      discountPrice: 99.95,
      installments: [
        { count: 1, amount: 99.95 },
        { count: 6, amount: 99.95 },
        { count: 12, amount: 99.95 },
      ] as Installment[],
    },
  ];

  await offerRepo.save(offerRepo.create(offers));

  const total = await offerRepo.count();
  console.log(`Seed concluido: ${total} ofertas criadas.`);

  await AppDataSource.destroy();
}

seed().catch(async (error) => {
  console.error(error);
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
