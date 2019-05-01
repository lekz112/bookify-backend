import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('meetups')
export class MeetupEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({nullable: false})
    name: string
    @Column({nullable: false})
    status: string
    @Column({type: "timestamp with time zone", default: "now()", name: "created_at", nullable: false})
    createdAt: Date    
}