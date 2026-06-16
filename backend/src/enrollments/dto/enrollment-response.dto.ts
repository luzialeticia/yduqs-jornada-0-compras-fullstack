import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../../common/enums';

export class EnrollmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  offerId: string;

  @ApiProperty({ nullable: true })
  installmentId: string | null;

  @ApiProperty()
  fullName: string;

  @ApiProperty({
    description: 'CPF mascarado para retorno',
    example: '***.982.247-**',
  })
  cpf: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty()
  createdAt: Date;
}
