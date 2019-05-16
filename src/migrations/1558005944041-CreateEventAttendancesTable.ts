import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEventAttendancesTable1558005944041 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            CREATE TABLE event_attendances (           
                id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),     
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,                
                event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                role VARCHAR(20) NOT NULL,
                canceled_at TIMESTAMP                              
            );            
            CREATE UNIQUE INDEX ON event_attendances (event_id, user_id) WHERE canceled_at IS NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`
            DROP TABLE event_attendances;
        `);
    }

}
