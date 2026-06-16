import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { OffersRepository } from '../offers/offers.repository';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentsRepository } from './enrollments.repository';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly offersRepository: OffersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EnrollmentsService.name);
  }

  async create(dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    const offer = await this.offersRepository.findById(dto.offerId);
    if (!offer || !offer.active) {
      throw new NotFoundException('Oferta nao encontrada ou indisponivel');
    }

    const installment =
      await this.enrollmentsRepository.findInstallmentForOffer(
        dto.installmentId,
        dto.offerId,
      );
    if (!installment) {
      throw new BadRequestException(
        'Opcao de parcelamento invalida para a oferta selecionada',
      );
    }

    const enrollment = await this.enrollmentsRepository.create({
      offerId: dto.offerId,
      installmentId: dto.installmentId,
      fullName: dto.fullName,
      cpf: dto.cpf,
      birthDate: dto.birthDate,
      email: dto.email,
      phone: dto.phone,
      acceptedTerms: dto.acceptedTerms,
      acceptedWhatsapp: dto.acceptedWhatsapp ?? false,
    });

    this.logger.info(
      {
        enrollmentId: enrollment.id,
        offerId: enrollment.offerId,
        installmentId: enrollment.installmentId,
      },
      'Matricula criada',
    );

    return this.toResponse(enrollment);
  }

  async findOne(id: string): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollmentsRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`Matricula ${id} nao encontrada`);
    }
    return this.toResponse(enrollment);
  }

  private toResponse(enrollment: Enrollment): EnrollmentResponseDto {
    return {
      id: enrollment.id,
      offerId: enrollment.offerId,
      installmentId: enrollment.installmentId,
      fullName: enrollment.fullName,
      cpf: this.maskCpf(enrollment.cpf),
      email: enrollment.email,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
    };
  }

  private maskCpf(cpf: string): string {
    return `***.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-**`;
  }
}
