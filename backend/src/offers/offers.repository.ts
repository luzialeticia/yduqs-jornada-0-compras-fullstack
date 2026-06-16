import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersRepository {
  constructor(
    @InjectRepository(Offer)
    private readonly offers: Repository<Offer>,
  ) {}

  findManyActive() {
    return this.offers.find({
      where: { active: true },
      relations: { installments: true },
      order: { courseName: 'ASC' },
    });
  }

  findById(id: string) {
    return this.offers.findOne({
      where: { id },
      relations: { installments: true },
    });
  }
}
