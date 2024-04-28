import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersSearchTrigger1705904131681 implements MigrationInterface {
  name = 'UsersSearchTrigger1705904131681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE INDEX users_search_idx
          ON users
          USING GIN (search_index);
        
        CREATE FUNCTION users_tsvector_trigger() 
        RETURNS trigger AS $$
          BEGIN
            NEW.search_index := to_tsvector(coalesce(NEW.name, '') || ' ' || coalesce(NEW.email, '') || ' ' || coalesce(NEW.company, '') || ' ' || coalesce(NEW.phone, ''));
            RETURN NEW;
          END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
            ON users FOR EACH ROW EXECUTE FUNCTION users_tsvector_trigger();
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TRIGGER IF EXISTS tsvector_update
          ON users;
          
        DROP FUNCTION IF EXISTS users_tsvector_trigger;
          
        DROP INDEX IF EXISTS users_search_idx;
      `,
    );
  }
}
