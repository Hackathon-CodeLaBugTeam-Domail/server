import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesSearchColumn1705999267140 implements MigrationInterface {
  name = 'RolesSearchColumn1705999267140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "search_index" tsvector NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "search_index"`);
  }
}
