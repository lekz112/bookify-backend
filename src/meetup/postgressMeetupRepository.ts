import { Connection, Not } from "typeorm";
import { MeetupRepository } from "./meetupRepository";
import { Meetup, MeetupStatus } from "./meetup";
import { MeetupEntity } from "./meetupEntity";

export class PostgressMetupRepository implements MeetupRepository {

    constructor(private connection: Connection) {
    }

    findAll(): Promise<Meetup[]> {
        return this.getORMRepository()
            .find({status: Not(MeetupStatus.Canceled)})                        
            .then(entities => entities.map(PostgressMetupRepository.mapToDomain))
    }

    findById(id: string): Promise<Meetup | undefined> {
        return this.getORMRepository()
            .findOne(id)
            .then(PostgressMetupRepository.mapToDomain)
    }

    async create(name: string): Promise<Meetup> {        
        let entity = this.getORMRepository()
            .create({
                name,
                status: MeetupStatus.Scheduled
            })

        return this.getORMRepository()
            .save(entity)
            .then(PostgressMetupRepository.mapToDomain)    
    }

    async setStatus(id: string, status: string): Promise<Meetup> {        
        const meetup = await this.getORMRepository()
            .findOneOrFail(id);
            
        return this.getORMRepository()
            .save({ ...meetup, status})
            .then(PostgressMetupRepository.mapToDomain);
    }

    private static mapToDomain(entity: MeetupEntity): Meetup {        
        return {
            ...entity,            
            status: entity.status as MeetupStatus
        }
    }    

    private getORMRepository() {
        return this.connection.getRepository(MeetupEntity)
    }
}