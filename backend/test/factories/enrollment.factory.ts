import { faker } from '@faker-js/faker';
import { EnrollmentStatus } from '../../src/common/enums';
import { CreateEnrollmentDto } from '../../src/enrollments/dto/create-enrollment.dto';
import { Enrollment } from '../../src/enrollments/entities/enrollment.entity';
import { Installment } from '../../src/offers/entities/installment.entity';
import { Offer } from '../../src/offers/entities/offer.entity';
import { generateValidCpf } from './cpf.factory';

export function makeCreateEnrollmentDto(
  overrides: Partial<CreateEnrollmentDto> = {},
): CreateEnrollmentDto {
  return {
    offerId: faker.string.uuid(),
    installmentId: faker.string.uuid(),
    fullName: faker.person.fullName(),
    cpf: generateValidCpf(),
    birthDate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    email: faker.internet.email().toLowerCase(),
    phone: faker.string.numeric(11),
    acceptedTerms: true,
    acceptedWhatsapp: true,
    ...overrides,
  };
}

export function makeEnrollment(
  overrides: Partial<Enrollment> = {},
): Enrollment {
  return {
    id: faker.string.uuid(),
    offerId: faker.string.uuid(),
    installmentId: faker.string.uuid(),
    fullName: faker.person.fullName(),
    cpf: generateValidCpf(),
    birthDate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
    email: faker.internet.email().toLowerCase(),
    phone: faker.string.numeric(11),
    acceptedTerms: true,
    acceptedWhatsapp: false,
    status: EnrollmentStatus.PENDING,
    createdAt: new Date(),
    offer: undefined as unknown as Offer,
    installment: undefined as unknown as Installment,
    ...overrides,
  } as Enrollment;
}
