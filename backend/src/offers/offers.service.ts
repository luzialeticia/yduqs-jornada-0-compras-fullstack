import { Injectable, NotFoundException } from '@nestjs/common';
import { OfferResponseDto } from './dto/offer-response.dto';
import { toOfferDto } from './offers.mapper';
import { OffersRepository } from './offers.repository';

@Injectable()
export class OffersService {
  constructor(private readonly offersRepository: OffersRepository) {}

  async findAll(): Promise<OfferResponseDto[]> {
    const offers = await this.offersRepository.findManyActive();
    return offers.map(toOfferDto);
  }

  async findOne(id: string): Promise<OfferResponseDto> {
    const offer = await this.offersRepository.findById(id);
    if (!offer) {
      throw new NotFoundException(`Oferta ${id} nao encontrada`);
    }
    return toOfferDto(offer);
  }
}
