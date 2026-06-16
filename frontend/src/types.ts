export type Modality = 'PRESENCIAL' | 'SEMIPRESENCIAL' | 'DIGITAL' | 'EAD';
export type Shift = 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL';
export type EnrollmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Installment {
  id: string;
  count: number;
  amount: number;
}

export interface Offer {
  id: string;
  courseName: string;
  modality: Modality;
  shift: Shift | null;
  originalPrice: number | null;
  discountPrice: number | null;
  cashPrice: number | null;
  priceOnRequest: boolean;
  campusName: string | null;
  campusAddress: string | null;
  installments: Installment[];
}

export interface CreateEnrollmentPayload {
  offerId: string;
  installmentId?: string;
  fullName: string;
  cpf: string;
  birthDate: string; // ISO (yyyy-mm-dd)
  email: string;
  phone: string;
  highSchoolCompletionYear?: number | null;
  acceptedTerms: boolean;
  acceptedWhatsapp: boolean;
}

export interface EnrollmentResponse {
  id: string;
  offerId: string;
  installmentId: string;
  fullName: string;
  cpf: string;
  email: string;
  status: EnrollmentStatus;
  createdAt: string;
}
