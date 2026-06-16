import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment } from './entities/installment.entity';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersRepository } from './offers.repository';
import { OffersService } from './offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Installment])],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
  exports: [OffersService, OffersRepository],
})
export class OffersModule {}
