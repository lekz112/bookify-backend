import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMeetupsTable1545363403115 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE meetups (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
                name TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE meetups
        `);
    }

}
