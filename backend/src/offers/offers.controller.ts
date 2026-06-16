import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OfferResponseDto } from './dto/offer-response.dto';
import { OffersService } from './offers.service';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as ofertas de cursos ativas' })
  @ApiOkResponse({ type: [OfferResponseDto] })
  findAll(): Promise<OfferResponseDto[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma oferta pelo id' })
  @ApiOkResponse({ type: OfferResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OfferResponseDto> {
    return this.offersService.findOne(id);
  }
}
