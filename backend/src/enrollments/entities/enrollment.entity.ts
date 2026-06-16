import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnrollmentStatus } from '../../common/enums';
import { Installment } from '../../offers/entities/installment.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity('enrollments')
@Index(['email'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Offer, (offer) => offer.enrollments)
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @Column()
  offerId: string;

  @ManyToOne(() => Installment, (installment) => installment.enrollments, {
    nullable: true,
  })
  @JoinColumn({ name: 'installmentId' })
  installment: Installment | null;

  @Column({ type: 'uuid', nullable: true })
  installmentId: string | null;

  @Column()
  fullName: string;

  @Column()
  cpf: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'int', nullable: true })
  highSchoolCompletionYear: number | null;

  @Column({ type: 'boolean' })
  acceptedTerms: boolean;

  @Column({ type: 'boolean', default: false })
  acceptedWhatsapp: boolean;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status: EnrollmentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
