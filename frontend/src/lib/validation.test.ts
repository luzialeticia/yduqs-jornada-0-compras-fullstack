import { describe, expect, it } from 'vitest';
import { maskCpf, maskPhone } from './format';
import {
  isValidBirthDate,
  isValidCpf,
  isValidEmail,
  isValidPhone,
} from './validation';

describe('validation', () => {
  it('valida CPF correto e rejeita inválido', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });

  it('valida e-mail', () => {
    expect(isValidEmail('maria@email.com')).toBe(true);
    expect(isValidEmail('sem-arroba')).toBe(false);
  });

  it('valida telefone com DDD', () => {
    expect(isValidPhone('(21) 99999-8888')).toBe(true);
    expect(isValidPhone('99999')).toBe(false);
  });

  it('valida data de nascimento (passado e idade mínima)', () => {
    expect(isValidBirthDate('2000-05-20')).toBe(true);
    expect(isValidBirthDate('3000-01-01')).toBe(false);
    expect(isValidBirthDate('')).toBe(false);
  });
});

describe('masks', () => {
  it('formata CPF', () => {
    expect(maskCpf('52998224725')).toBe('529.982.247-25');
  });

  it('formata telefone', () => {
    expect(maskPhone('21999998888')).toBe('(21) 99999-8888');
  });
});
