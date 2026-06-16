import type { Offer } from '../types';

export const mockOffer: Offer = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  courseName: 'Análise e Desenvolvimento de Sistemas',
  modality: 'PRESENCIAL',
  shift: 'MANHA',
  originalPrice: 339.9,
  discountPrice: 169.95,
  cashPrice: 2613.6,
  priceOnRequest: false,
  campusName: 'Barra da Tijuca - Tom Jobim',
  campusAddress: 'Av. das Américas, 4.200, Bloco 3 - Barra da Tijuca, RJ',
  installments: [
    { id: 'inst-1', count: 1, amount: 169.95 },
    { id: 'inst-12', count: 12, amount: 169.95 },
  ],
};

export const mockTapumeOffer: Offer = {
  id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  courseName: 'Engenharia de Software',
  modality: 'DIGITAL',
  shift: null,
  originalPrice: null,
  discountPrice: null,
  cashPrice: null,
  priceOnRequest: true,
  campusName: 'Polo Digital',
  campusAddress: 'Conteúdo 100% online com tutoria a distância',
  installments: [],
};
