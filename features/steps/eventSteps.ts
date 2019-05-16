import { expect } from 'chai';
import { Then, When } from "cucumber";
import { createEventMutation } from '../queries/createMeetupMutation';
import { CancelEventMutation } from '../queries/cancelMeetupMutation';
import { EventStatus, Event, EventAttendanceRole } from '../../src/types';
import { eventsQuery } from '../queries/eventsQuery';

When('the user creates a event called {string}', async function (name) {    
    const response = await this.client.mutate({ mutation: createEventMutation, variables: { name } });
    this.response = (response.data as any).createEvent;    
});

Then('the event called {string} should be created', function (name) {
    expect(this.response.name).to.be.equal(name);
});

Then('the user should be the owner of the event', function () {
    expect(this.response.attendees[0].role).to.be.equal(EventAttendanceRole.Owner);
    expect(this.response.attendees[0].user.email).to.be.equal(this.signedInUserEmail);
});

When('the user fetches list of events', async function () {
    const result = await this.client.query({ query: eventsQuery });
    this.response = (result.data as any).events;
});

Then('the user should see event called {string} in the list', function (name) {
    expect(this.response[0].name).to.be.equal(name);
});

When('the user cancels the event called {string}', async function(name: string) {    
    const events = await this.client.query({ query: eventsQuery });    
    const id = (events.data as any).events.find((event: Event) => event.name == name).id;    
    const response = await this.client.mutate({ mutation: CancelEventMutation, variables: { id } });    
    this.response = (response.data as any).cancelEvent;
});

Then('the event should be caneceled', function () {
    expect(this.response.status).to.be.equal(EventStatus.Canceled);
});