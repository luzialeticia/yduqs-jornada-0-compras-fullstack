import { NotFoundException } from '@nestjs/common';
import { makeOffer } from '@test/factories';
import { OffersRepository } from './offers.repository';
import { OffersService } from './offers.service';

describe('OffersService', () => {
  let service: OffersService;
  let repository: jest.Mocked<OffersRepository>;

  beforeEach(() => {
    repository = {
      findManyActive: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<OffersRepository>;
    service = new OffersService(repository);
  });

  it('mapeia a oferta e ordena as parcelas por quantidade', async () => {
    repository.findManyActive.mockResolvedValue([makeOffer()]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].discountPrice).toBe(169.95);
    expect(result[0].installments.map((i) => i.count)).toEqual([1, 12]);
  });

  it('retorna a oferta por id', async () => {
    const offer = makeOffer();
    repository.findById.mockResolvedValue(offer);

    const result = await service.findOne(offer.id);

    expect(result.id).toBe(offer.id);
    expect(result.courseName).toContain('Análise');
  });

  it('lanca NotFound quando a oferta nao existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('inexistente')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
