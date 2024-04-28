import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoriesSearchTrigger1705980656844
  implements MigrationInterface
{
  name: 'CategoriesSearchTrigger1705980656844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE INDEX categories_search_idx
          ON categories
          USING GIN (search_index);
        
        CREATE FUNCTION categories_tsvector_trigger() 
        RETURNS trigger AS $$
          BEGIN
            NEW.search_index := to_tsvector(coalesce(NEW.name, ''));
            RETURN NEW;
          END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
            ON categories FOR EACH ROW EXECUTE FUNCTION categories_tsvector_trigger();
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TRIGGER IF EXISTS tsvector_update
          ON categories;
          
        DROP FUNCTION IF EXISTS categories_tsvector_trigger;
          
        DROP INDEX IF EXISTS categories_search_idx;
      `,
    );
  }
}
