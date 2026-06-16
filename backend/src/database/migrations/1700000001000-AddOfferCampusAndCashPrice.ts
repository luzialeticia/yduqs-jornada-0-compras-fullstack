import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfferCampusAndCashPrice1700000001000 implements MigrationInterface {
  name = 'AddOfferCampusAndCashPrice1700000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "cashPrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "campusName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "campusAddress" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "campusAddress"`);
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "campusName"`);
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "cashPrice"`);
  }
}
