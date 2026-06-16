import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnrollmentCompletionYear1700000002000 implements MigrationInterface {
  name = 'AddEnrollmentCompletionYear1700000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollments" ADD "highSchoolCompletionYear" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP COLUMN "highSchoolCompletionYear"`,
    );
  }
}
