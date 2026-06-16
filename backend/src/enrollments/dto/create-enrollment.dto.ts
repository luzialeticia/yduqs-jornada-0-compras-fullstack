import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxDate,
} from 'class-validator';
import { IsCpf, onlyDigits } from '../../common/validators/cpf';

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Id da oferta escolhida' })
  @IsUUID()
  offerId: string;

  @ApiProperty({ description: 'Id da opcao de parcelamento escolhida' })
  @IsUUID()
  installmentId: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @Length(3, 120)
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @ApiProperty({ example: '529.982.247-25', description: 'CPF valido' })
  @IsCpf()
  @Transform(({ value }) => onlyDigits(value))
  cpf: string;

  @ApiProperty({
    example: '2000-05-20',
    description: 'Data de nascimento (ISO, deve ser no passado)',
  })
  @Type(() => Date)
  @IsDate({ message: 'birthDate deve ser uma data valida' })
  @MaxDate(() => new Date(), {
    message: 'birthDate deve ser uma data no passado',
  })
  birthDate: Date;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '21999998888', description: 'Telefone com DDD' })
  @Transform(({ value }) => onlyDigits(value))
  @Matches(/^\d{10,11}$/, {
    message: 'phone deve conter DDD + numero (10 ou 11 digitos)',
  })
  phone: string;

  @ApiProperty({ description: 'Aceite obrigatorio dos termos de uso' })
  @IsBoolean()
  @Equals(true, { message: 'E necessario aceitar os termos de uso' })
  acceptedTerms: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  acceptedWhatsapp?: boolean;
}
