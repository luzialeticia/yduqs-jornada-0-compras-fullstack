import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Realiza a matricula em uma oferta' })
  @ApiCreatedResponse({ type: EnrollmentResponseDto })
  create(@Body() dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta uma matricula pelo id' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.findOne(id);
  }
}
