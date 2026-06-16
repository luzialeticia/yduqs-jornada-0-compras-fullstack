import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../common/transformers/decimal.transformer';
import { Modality, Shift } from '../../common/enums';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Installment } from './installment.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseName: string;

  @Column({ type: 'enum', enum: Modality })
  modality: Modality;

  @Column({ type: 'enum', enum: Shift, nullable: true })
  shift: Shift | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new DecimalTransformer(),
  })
  originalPrice: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new DecimalTransformer(),
  })
  discountPrice: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: new DecimalTransformer(),
  })
  cashPrice: number | null;

  @Column({ type: 'varchar', nullable: true })
  campusName: string | null;

  @Column({ type: 'varchar', nullable: true })
  campusAddress: string | null;

  @Column({ default: false })
  priceOnRequest: boolean;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Installment, (installment) => installment.offer, {
    cascade: true,
  })
  installments: Installment[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.offer)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
