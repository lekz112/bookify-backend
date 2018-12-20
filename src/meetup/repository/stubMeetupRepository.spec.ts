import { StubMeetupRepository } from "./stubMeetupRepository";

describe('Stub Meetup Repository', () => {
    const repository = new StubMeetupRepository();

    beforeEach(() => {
        repository.meetupList = [];
    });

    describe('.findById', () => {        
        it('returns empty list when repository is empty', async () => {
            const meetups = await repository.findAll();
            
            expect(meetups).toHaveLength(0);
        });
    });

    describe('.delete', () => {
        it('throws and error if meetup is not found', async () => {
            return expect(repository.delete('id')).rejects.toThrowError();
        });
    });
});