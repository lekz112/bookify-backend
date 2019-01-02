import { expect } from 'chai';
import { Then, When, After } from "cucumber";
import { CreateMeetupMutation } from '../queries/createMeetupMutation';
import { MeetupRole } from '../../src/meetup/meetupAttendanceRepository';
import { MeetupsQuery } from '../queries/meetupsQuery';

When(/^the user creates a meetup called '(.*)'$/, async function (name) {
    const response = await this.client.mutate({ mutation: CreateMeetupMutation, variables: { name: name } });
    this.response = (response.data as any).createMeetup;
});

Then(/^the meetup called '(.*)' should be created$/, function (name) {
    expect(this.response.name).to.be.equal(name);
});

Then(/^the user should be the owner of the meetup$/, function () {
    expect(this.response.attendees[0].role).to.be.equal(MeetupRole.Owner);
    expect(this.response.attendees[0].user.id).to.be.equal(this.userId);
});

When(/^the user fetches list of meetups/, async function () {
    const result = await this.client.query({ query: MeetupsQuery });
    this.response = (result.data as any).meetups;
});

Then(/^the user should see meetup called '(.*)' in the list/, function (name) {
    expect(this.response[0].name).to.be.equal(name);    
});