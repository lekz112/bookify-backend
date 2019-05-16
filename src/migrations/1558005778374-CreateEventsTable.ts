import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEventsTable1558005778374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE events (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE events
        `);
    }

}
