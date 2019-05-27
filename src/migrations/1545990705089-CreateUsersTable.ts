import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsersTable1545990705089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE users (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
                email VARCHAR(255) NOT NULL,                
                name TEXT NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            CREATE UNIQUE INDEX users_email on users (email);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE users
        `);
    }

}
