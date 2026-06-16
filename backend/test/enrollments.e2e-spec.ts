import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Offer } from '../src/offers/entities/offer.entity';

describe('Jornada de compras (e2e)', () => {
  let app: INestApplication;
  let offerId: string;
  let installmentId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const dataSource = app.get(DataSource);
    const offer = await dataSource.getRepository(Offer).findOne({
      where: { active: true },
      relations: { installments: true },
    });
    if (!offer) throw new Error('Rode o seed antes do e2e (yarn db:seed)');
    offerId = offer.id;
    installmentId = offer.installments[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /offers retorna ofertas com parcelas', async () => {
    const res = await request(app.getHttpServer()).get('/offers').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('installments');
  });

  it('POST /enrollments cria matricula com dados validos', async () => {
    const res = await request(app.getHttpServer())
      .post('/enrollments')
      .send({
        offerId,
        installmentId,
        fullName: 'Maria da Silva',
        cpf: '529.982.247-25',
        birthDate: '2000-05-20',
        email: 'maria@email.com',
        phone: '(21) 99999-8888',
        acceptedTerms: true,
        acceptedWhatsapp: true,
      })
      .expect(201);

    expect(res.body.status).toBe('PENDING');
    expect(res.body.cpf).toBe('***.982.247-**');
  });

  it('POST /enrollments rejeita CPF e email invalidos', async () => {
    const res = await request(app.getHttpServer())
      .post('/enrollments')
      .send({
        offerId,
        installmentId,
        fullName: 'Jo',
        cpf: '111.111.111-11',
        birthDate: '2000-05-20',
        email: 'invalido',
        phone: '123',
        acceptedTerms: false,
      })
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining([expect.any(String)]),
    );
  });

  it('POST /enrollments rejeita aceite de termos ausente', async () => {
    await request(app.getHttpServer())
      .post('/enrollments')
      .send({
        offerId,
        installmentId,
        fullName: 'Maria da Silva',
        cpf: '529.982.247-25',
        birthDate: '2000-05-20',
        email: 'maria2@email.com',
        phone: '21999998888',
        acceptedTerms: false,
      })
      .expect(400);
  });
});
