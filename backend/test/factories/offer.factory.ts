import { faker } from '@faker-js/faker';
import { Modality, Shift } from '../../src/common/enums';
import { Installment } from '../../src/offers/entities/installment.entity';
import { Offer } from '../../src/offers/entities/offer.entity';

export function makeInstallment(
  overrides: Partial<Installment> = {},
): Installment {
  return {
    id: faker.string.uuid(),
    offerId: faker.string.uuid(),
    count: 12,
    amount: 169.95,
    offer: undefined as unknown as Offer,
    enrollments: [],
    ...overrides,
  } as Installment;
}

export function makeOffer(overrides: Partial<Offer> = {}): Offer {
  const id = overrides.id ?? faker.string.uuid();
  return {
    id,
    courseName: 'Análise e Desenvolvimento de Sistemas',
    modality: Modality.PRESENCIAL,
    shift: Shift.MANHA,
    originalPrice: 339.9,
    discountPrice: 169.95,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollments: [],
    installments: [
      makeInstallment({ offerId: id, count: 12, amount: 169.95 }),
      makeInstallment({ offerId: id, count: 1, amount: 169.95 }),
    ],
    ...overrides,
  } as Offer;
}
