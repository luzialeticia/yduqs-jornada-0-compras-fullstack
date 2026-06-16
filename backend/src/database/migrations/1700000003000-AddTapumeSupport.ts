import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTapumeSupport1700000003000 implements MigrationInterface {
  name = 'AddTapumeSupport1700000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "priceOnRequest" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ALTER COLUMN "originalPrice" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ALTER COLUMN "discountPrice" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" ALTER COLUMN "installmentId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollments" ALTER COLUMN "installmentId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ALTER COLUMN "discountPrice" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ALTER COLUMN "originalPrice" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" DROP COLUMN "priceOnRequest"`,
    );
  }
}
