import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "offers_modality_enum" AS ENUM ('PRESENCIAL', 'SEMIPRESENCIAL', 'DIGITAL', 'EAD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "offers_shift_enum" AS ENUM ('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "enrollments_status_enum" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "offers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "courseName" character varying NOT NULL,
        "modality" "offers_modality_enum" NOT NULL,
        "shift" "offers_shift_enum",
        "originalPrice" numeric(10,2) NOT NULL,
        "discountPrice" numeric(10,2) NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_offers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "installments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "offerId" uuid NOT NULL,
        "count" integer NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_installments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_installments_offer_count" UNIQUE ("offerId", "count")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "enrollments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "offerId" uuid NOT NULL,
        "installmentId" uuid NOT NULL,
        "fullName" character varying NOT NULL,
        "cpf" character varying NOT NULL,
        "birthDate" date NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "acceptedTerms" boolean NOT NULL,
        "acceptedWhatsapp" boolean NOT NULL DEFAULT false,
        "status" "enrollments_status_enum" NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_enrollments" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_enrollments_email" ON "enrollments" ("email")`,
    );

    await queryRunner.query(
      `ALTER TABLE "installments" ADD CONSTRAINT "FK_installments_offer" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_offer" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_installment" FOREIGN KEY ("installmentId") REFERENCES "installments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_installment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_offer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installments" DROP CONSTRAINT "FK_installments_offer"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_enrollments_email"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(`DROP TABLE "installments"`);
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TYPE "enrollments_status_enum"`);
    await queryRunner.query(`DROP TYPE "offers_shift_enum"`);
    await queryRunner.query(`DROP TYPE "offers_modality_enum"`);
  }
}
