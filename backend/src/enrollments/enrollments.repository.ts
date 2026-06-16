import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Installment } from '../offers/entities/installment.entity';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(Installment)
    private readonly installments: Repository<Installment>,
  ) {}

  create(data: DeepPartial<Enrollment>) {
    return this.enrollments.save(this.enrollments.create(data));
  }

  findById(id: string) {
    return this.enrollments.findOne({ where: { id } });
  }

  findInstallmentForOffer(installmentId: string, offerId: string) {
    return this.installments.findOne({
      where: { id: installmentId, offerId },
    });
  }
}
