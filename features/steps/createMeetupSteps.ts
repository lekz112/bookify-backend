import { expect } from 'chai';
import { Then, When, After, Given } from "cucumber";
import { CreateMeetupMutation } from '../queries/createMeetupMutation';
import { CancelMeetupMutation } from '../queries/cancelMeetupMutation';
import { MeetupRole } from '../../src/meetup/meetupAttendanceRepository';
import { MeetupsQuery } from '../queries/meetupsQuery';
import { MeetupStatus } from '../../src/meetup/meetupRepository';
import { Meetup } from '../../src/types';

When(/^the user creates a meetup called '(.*)'$/, async function (name) {
    const response = await this.client.mutate({ mutation: CreateMeetupMutation, variables: { name: name } });
    this.response = (response.data as any).createMeetup;
    console.log(this.response);
});

Then(/^the meetup called '(.*)' should be created$/, function (name) {
    expect(this.response.name).to.be.equal(name);
});

Then(/^the user should be the owner of the meetup$/, function () {
    // expect(this.response.attendees[0].role).to.be.equal(MeetupRole.Owner);
    // expect(this.response.attendees[0].user.id).to.be.equal(this.userId);
});

When(/^the user fetches list of meetups/, async function () {
    const result = await this.client.query({ query: MeetupsQuery });
    this.response = (result.data as any).meetups;
});

Then(/^the user should see meetup called '(.*)' in the list/, function (name) {
    expect(this.response[0].name).to.be.equal(name);
});

When(/^the user cancels the meetup called '(.*)'$/, async function(name) {
    const meetups = await this.client.query({ query: MeetupsQuery });
    const id = (meetups.data as any).meetups.find((meetup: Meetup) => meetup.name == name).id;
    const response = await this.client.mutate({ mutation: CancelMeetupMutation, variables: { id } });
    this.response = (response.data as any).cancelMeetup;
});

Then(/^the meetup should be caneceled$/, function () {
    expect(this.response.status).to.be.equal(MeetupStatus.Canceled);
});