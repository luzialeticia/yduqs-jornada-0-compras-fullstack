import { generateValidCpf } from '@test/factories';
import { isValidCpf, onlyDigits } from './cpf';

describe('cpf utils', () => {
  describe('onlyDigits', () => {
    it('remove mascara do CPF', () => {
      expect(onlyDigits('529.982.247-25')).toBe('52998224725');
    });

    it('lida com valor vazio/undefined', () => {
      expect(onlyDigits(undefined as unknown as string)).toBe('');
    });
  });

  describe('isValidCpf', () => {
    it('aceita CPF valido com mascara', () => {
      expect(isValidCpf('529.982.247-25')).toBe(true);
    });

    it('aceita CPF valido sem mascara', () => {
      expect(isValidCpf('52998224725')).toBe(true);
    });

    it('rejeita CPF com digito verificador errado', () => {
      expect(isValidCpf('529.982.247-24')).toBe(false);
    });

    it('rejeita sequencia repetida', () => {
      expect(isValidCpf('111.111.111-11')).toBe(false);
    });

    it('rejeita tamanho invalido', () => {
      expect(isValidCpf('123')).toBe(false);
    });

    it('valida CPFs gerados pelo helper de testes', () => {
      for (let i = 0; i < 20; i++) {
        expect(isValidCpf(generateValidCpf())).toBe(true);
      }
    });
  });
});
