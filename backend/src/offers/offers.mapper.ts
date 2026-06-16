import {
  InstallmentResponseDto,
  OfferResponseDto,
} from './dto/offer-response.dto';
import { Installment } from './entities/installment.entity';
import { Offer } from './entities/offer.entity';

export function toInstallmentDto(
  installment: Installment,
): InstallmentResponseDto {
  return {
    id: installment.id,
    count: installment.count,
    amount: installment.amount,
  };
}

export function toOfferDto(offer: Offer): OfferResponseDto {
  return {
    id: offer.id,
    courseName: offer.courseName,
    modality: offer.modality,
    shift: offer.shift,
    originalPrice: offer.originalPrice,
    discountPrice: offer.discountPrice,
    priceOnRequest: offer.priceOnRequest,
    cashPrice: offer.cashPrice,
    campusName: offer.campusName,
    campusAddress: offer.campusAddress,
    installments: [...(offer.installments ?? [])]
      .sort((a, b) => a.count - b.count)
      .map(toInstallmentDto),
  };
}
