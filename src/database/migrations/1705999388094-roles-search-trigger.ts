import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesSearchTrigger1705999388094 implements MigrationInterface {
  name: 'RolesSearchTrigger1705999388094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE INDEX roles_search_idx
          ON roles
          USING GIN (search_index);
        
        CREATE FUNCTION roles_tsvector_trigger() 
        RETURNS trigger AS $$
          BEGIN
            NEW.search_index := to_tsvector(coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
            RETURN NEW;
          END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
            ON roles FOR EACH ROW EXECUTE FUNCTION roles_tsvector_trigger();
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP TRIGGER IF EXISTS tsvector_update
          ON roles;
          
        DROP FUNCTION IF EXISTS roles_tsvector_trigger;
          
        DROP INDEX IF EXISTS roles;
      `,
    );
  }
}
