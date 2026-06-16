import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Installment } from '../offers/entities/installment.entity';
import { Offer } from '../offers/entities/offer.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Offer, Installment, Enrollment],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
