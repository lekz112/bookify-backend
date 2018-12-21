import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExtensionUUIDOSSP1545363361459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return;
    }

}
