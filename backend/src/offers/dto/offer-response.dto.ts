import { ApiProperty } from '@nestjs/swagger';
import { Modality, Shift } from '../../common/enums';

export class InstallmentResponseDto {
  @ApiProperty({ example: 'b1c2...' })
  id: string;

  @ApiProperty({ example: 12, description: 'Quantidade de parcelas' })
  count: number;

  @ApiProperty({ example: 169.95, description: 'Valor de cada parcela' })
  amount: number;
}

export class OfferResponseDto {
  @ApiProperty({ example: 'a1b2...' })
  id: string;

  @ApiProperty({ example: 'Análise e Desenvolvimento de Sistemas' })
  courseName: string;

  @ApiProperty({ enum: Modality, example: Modality.PRESENCIAL })
  modality: Modality;

  @ApiProperty({ enum: Shift, nullable: true, example: Shift.MANHA })
  shift: Shift | null;

  @ApiProperty({ example: 339.9 })
  originalPrice: number;

  @ApiProperty({ example: 169.95 })
  discountPrice: number;

  @ApiProperty({ type: [InstallmentResponseDto] })
  installments: InstallmentResponseDto[];
}
