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

  @ApiProperty({ example: 4752.0, nullable: true })
  originalPrice: number | null;

  @ApiProperty({ example: 169.95, nullable: true })
  discountPrice: number | null;

  @ApiProperty({
    example: false,
    description: 'Quando true, a oferta não exibe preço (tapume).',
  })
  priceOnRequest: boolean;

  @ApiProperty({
    example: 2613.6,
    nullable: true,
    description: 'Valor à vista (pagamento único)',
  })
  cashPrice: number | null;

  @ApiProperty({
    example: 'Barra da Tijuca - Tom Jobim',
    nullable: true,
  })
  campusName: string | null;

  @ApiProperty({
    example: 'Av. das Américas, 4.200, Bloco 3 - Barra da Tijuca',
    nullable: true,
  })
  campusAddress: string | null;

  @ApiProperty({ type: [InstallmentResponseDto] })
  installments: InstallmentResponseDto[];
}
