import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMeetupAttendanceTable1546260272481 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE meetup_attendances (                
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,                
                meetup_id uuid NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
                role VARCHAR(20) NOT NULL,
                canceled_at TIMESTAMP                              
            );            
            CREATE UNIQUE INDEX ON meetup_attendances (meetup_id, user_id) WHERE canceled_at IS NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE meetup_attendances;
        `);
    }

}
