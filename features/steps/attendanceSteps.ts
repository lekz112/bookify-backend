import { expect } from 'chai';
import { Then, When, Given } from "cucumber";
import { Event, EventAttendance } from "../../src/types";
import { applyForEventMutation } from '../queries/applyForMeetupMutation';
import { cancelEventAttendanceMutation } from '../queries/cancelMeetupAttendance';
import { eventByIdQuery } from '../queries/eventByIdQuery';

Given('the user is an attendee at the event {string}', async function (name: string) {
    const eventId = this.events.get(name);
    await this.client.mutate({ mutation: applyForEventMutation, variables: { eventId } });
});

When('the user applies for the event {string}', async function (name: string) {
    const eventId = this.events.get(name);
    try {
        this.response = await this.client.mutate({ mutation: applyForEventMutation, variables: { eventId } });
    }
    catch (error) {
        this.error = error;
    }
});

When('the user cancels attendance to the event {string}', async function (name: string) {
    const eventId = this.events.get(name);
    try {
        this.response = await this.client.mutate({ mutation: cancelEventAttendanceMutation, variables: { eventId } });        
    }
    catch (error) {
        this.error = error;
    }
});

Then('the user should receive successfull reservation with status {string} and role {string}', function (status: string, role: string) {
    const reservation = this.response.data.applyForEvent;
    expect(reservation.status).to.be.equal(status);
    expect(reservation.role).to.be.equal(role);
});

Then('the user should receive his reservation with status {string}', function (status: string) {
    const reservation = this.response.data.cancelEventAttendance;    
    expect(reservation.status).to.be.equal(status);    
});

Then('the user should be an attendee for the event {string}', async function (name: string) {
    const eventId = this.events.get(name)
    const response = await this.client.query({ query: eventByIdQuery, variables: { id: eventId } });
    const event = response.data.event as Event;

    expect(event.attendees.some(
        (attendee) => attendee.user.email == this.signedInUserEmail
    )).to.be.true
});

Then('the user should see an error {string}', function (error: string) {
    expect(this.error.graphQLErrors[0].message).to.be.equal(error);
});