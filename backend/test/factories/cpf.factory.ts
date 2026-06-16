import { faker } from '@faker-js/faker';

function checkDigit(digits: number[]): number {
  const factor = digits.length + 1;
  const sum = digits.reduce((acc, digit, i) => acc + digit * (factor - i), 0);
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function generateValidCpf(): string {
  const base = faker.helpers.multiple(
    () => faker.number.int({ min: 0, max: 9 }),
    { count: 9 },
  );
  const d1 = checkDigit(base);
  const d2 = checkDigit([...base, d1]);
  return [...base, d1, d2].join('');
}

export function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
