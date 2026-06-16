import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { makeCreateEnrollmentDto } from '@test/factories';
import { CreateEnrollmentDto } from './create-enrollment.dto';

/** Aplica as mesmas regras do ValidationPipe global e retorna os erros. */
function validate(payload: object) {
  const dto = plainToInstance(CreateEnrollmentDto, payload);
  const errors = validateSync(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return { dto, properties: errors.map((e) => e.property) };
}

describe('CreateEnrollmentDto', () => {
  it('aceita um payload valido e sanitiza os campos', () => {
    const { dto, properties } = validate(
      makeCreateEnrollmentDto({
        cpf: '529.982.247-25',
        email: 'Maria@Email.com ',
        phone: '(21) 99999-8888',
      }),
    );

    expect(properties).toHaveLength(0);
    expect(dto.cpf).toBe('52998224725');
    expect(dto.phone).toBe('21999998888');
    expect(dto.email).toBe('maria@email.com');
  });

  it('rejeita CPF invalido', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ cpf: '111.111.111-11' }),
    );
    expect(properties).toContain('cpf');
  });

  it('rejeita email invalido', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ email: 'sem-arroba' }),
    );
    expect(properties).toContain('email');
  });

  it('rejeita telefone com digitos insuficientes', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ phone: '99999' }),
    );
    expect(properties).toContain('phone');
  });

  it('rejeita data de nascimento no futuro', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ birthDate: new Date('3000-01-01') }),
    );
    expect(properties).toContain('birthDate');
  });

  it('exige o aceite dos termos', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ acceptedTerms: false }),
    );
    expect(properties).toContain('acceptedTerms');
  });

  it('rejeita ids que nao sao UUID', () => {
    const { properties } = validate(
      makeCreateEnrollmentDto({ offerId: 'abc' }),
    );
    expect(properties).toContain('offerId');
  });
});
