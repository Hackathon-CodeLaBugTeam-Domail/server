import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoriesUniqueSearch1705922797400 implements MigrationInterface {
  name = 'CategoriesUniqueSearch1705922797400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "search_index" tsvector NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4ff7139d9373440427c190ffd1" ON "categories" ("name") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ff7139d9373440427c190ffd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "search_index"`,
    );
  }
}
