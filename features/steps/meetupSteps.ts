import { expect } from 'chai';
import { Then, When, After, Given } from "cucumber";
import { createMeetupMutation } from '../queries/createMeetupMutation';
import { CancelMeetupMutation } from '../queries/cancelMeetupMutation';
import { MeetupsQuery } from '../queries/meetupsQuery';
import { Meetup, MeetupRole } from '../../src/types';
import { MeetupStatus } from '../../src/meetup/meetup';

When('the user creates a meetup called {string}', async function (name) {    
    const response = await this.client.mutate({ mutation: createMeetupMutation, variables: { name } });
    this.response = (response.data as any).createMeetup;    
});

Then('the meetup called {string} should be created', function (name) {
    expect(this.response.name).to.be.equal(name);
});

Then('the user should be the owner of the meetup', function () {
    expect(this.response.attendees[0].role).to.be.equal(MeetupRole.Owner);
    expect(this.response.attendees[0].user.email).to.be.equal(this.signedInUserEmail);
});

When('the user fetches list of meetups', async function () {
    const result = await this.client.query({ query: MeetupsQuery });
    this.response = (result.data as any).meetups;
});

Then('the user should see meetup called {string} in the list', function (name) {
    expect(this.response[0].name).to.be.equal(name);
});

When('the user cancels the meetup called {string}', async function(name: string) {    
    const meetups = await this.client.query({ query: MeetupsQuery });    
    const id = (meetups.data as any).meetups.find((meetup: Meetup) => meetup.name == name).id;    
    const response = await this.client.mutate({ mutation: CancelMeetupMutation, variables: { id } });    
    this.response = (response.data as any).cancelMeetup;
});

Then('the meetup should be caneceled', function () {
    expect(this.response.status).to.be.equal(MeetupStatus.Canceled);
});