import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  makeCreateEnrollmentDto,
  makeEnrollment,
  makeInstallment,
  makeOffer,
} from '@test/factories';
import { OffersRepository } from '../offers/offers.repository';
import { EnrollmentsRepository } from './enrollments.repository';
import { EnrollmentsService } from './enrollments.service';

const loggerStub = {
  setContext: jest.fn(),
  info: jest.fn(),
} as unknown as PinoLogger;

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentsRepo: jest.Mocked<EnrollmentsRepository>;
  let offersRepo: jest.Mocked<OffersRepository>;

  beforeEach(() => {
    enrollmentsRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findInstallmentForOffer: jest.fn(),
    } as unknown as jest.Mocked<EnrollmentsRepository>;
    offersRepo = {
      findById: jest.fn(),
      findManyActive: jest.fn(),
    } as unknown as jest.Mocked<OffersRepository>;
    service = new EnrollmentsService(enrollmentsRepo, offersRepo, loggerStub);
  });

  it('cria a matricula e mascara o CPF', async () => {
    const dto = makeCreateEnrollmentDto({ cpf: '52998224725' });
    offersRepo.findById.mockResolvedValue(makeOffer({ id: dto.offerId }));
    enrollmentsRepo.findInstallmentForOffer.mockResolvedValue(
      makeInstallment({ id: dto.installmentId }),
    );
    enrollmentsRepo.create.mockResolvedValue(makeEnrollment({ cpf: dto.cpf }));

    const result = await service.create(dto);

    expect(enrollmentsRepo.create).toHaveBeenCalledTimes(1);
    expect(result.cpf).toBe('***.982.247-**');
    expect(result.status).toBe('PENDING');
  });

  it('rejeita quando a oferta nao existe', async () => {
    const dto = makeCreateEnrollmentDto();
    offersRepo.findById.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(enrollmentsRepo.create).not.toHaveBeenCalled();
  });

  it('rejeita oferta inativa', async () => {
    const dto = makeCreateEnrollmentDto();
    offersRepo.findById.mockResolvedValue(makeOffer({ active: false }));

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(enrollmentsRepo.create).not.toHaveBeenCalled();
  });

  it('rejeita parcelamento que nao pertence a oferta', async () => {
    const dto = makeCreateEnrollmentDto();
    offersRepo.findById.mockResolvedValue(makeOffer({ id: dto.offerId }));
    enrollmentsRepo.findInstallmentForOffer.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('exige parcela quando a oferta tem parcelamento', async () => {
    const dto = makeCreateEnrollmentDto({ installmentId: undefined });
    offersRepo.findById.mockResolvedValue(makeOffer({ id: dto.offerId }));

    await expect(service.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('cria matricula sem parcela em oferta tapume (sem preço)', async () => {
    const dto = makeCreateEnrollmentDto({ installmentId: undefined });
    offersRepo.findById.mockResolvedValue(
      makeOffer({ id: dto.offerId, priceOnRequest: true, installments: [] }),
    );
    enrollmentsRepo.create.mockResolvedValue(
      makeEnrollment({ installmentId: null }),
    );

    const result = await service.create(dto);

    expect(enrollmentsRepo.findInstallmentForOffer).not.toHaveBeenCalled();
    expect(enrollmentsRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ installmentId: null }),
    );
    expect(result.status).toBe('PENDING');
  });
});
