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
      originalPrice: 4752.0,
      discountPrice: 169.95,
      cashPrice: 2613.6,
      campusName: 'Barra da Tijuca - Tom Jobim',
      campusAddress: 'Av. das Américas, 4.200, Bloco 3 - Barra da Tijuca, RJ',
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
      originalPrice: 2400.0,
      discountPrice: 129.95,
      cashPrice: 1399.0,
      campusName: 'Polo Digital',
      campusAddress: 'Conteúdo 100% online com encontros opcionais no polo',
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
      originalPrice: 5400.0,
      discountPrice: 149.95,
      cashPrice: 2880.0,
      campusName: 'Centro - Menezes Côrtes',
      campusAddress: 'Rua São José, 35 - Centro, Rio de Janeiro, RJ',
      installments: [
        { count: 1, amount: 149.95 },
        { count: 12, amount: 149.95 },
        { count: 24, amount: 149.95 },
      ] as Installment[],
    },
    {
      courseName: 'Pedagogia',
      modality: Modality.DIGITAL,
      shift: null,
      originalPrice: 1800.0,
      discountPrice: 99.95,
      cashPrice: 999.0,
      campusName: 'Polo Digital',
      campusAddress: 'Conteúdo 100% online com tutoria a distância',
      installments: [
        { count: 1, amount: 99.95 },
        { count: 6, amount: 99.95 },
        { count: 12, amount: 99.95 },
      ] as Installment[],
    },
    {
      // Oferta "tapume": sem preço divulgado e sem parcelamento.
      courseName: 'Engenharia de Software',
      modality: Modality.DIGITAL,
      shift: null,
      priceOnRequest: true,
      originalPrice: null,
      discountPrice: null,
      cashPrice: null,
      campusName: 'Polo Digital',
      campusAddress: 'Conteúdo 100% online com tutoria a distância',
      installments: [],
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
