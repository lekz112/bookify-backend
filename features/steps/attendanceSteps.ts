import { expect } from 'chai';
import { Then, When, Given } from "cucumber";
import { Meetup, MeetupAttendance } from "../../src/types";
import { applyForMeetupMutation } from '../queries/applyForMeetupMutation';
import { cancelMeetupAttendanceMutation } from '../queries/cancelMeetupAttendance';
import { meetupByIdQuery } from '../queries/meetupByIdQuery';

Given('the user is an attendee at the meetup {string}', async function (name: string) {
    const meetupId = this.meetups.get(name);
    await this.client.mutate({ mutation: applyForMeetupMutation, variables: { meetupId } });
});

When('the user applies for the meetup {string}', async function (name: string) {
    const meetupId = this.meetups.get(name);
    try {
        this.response = await this.client.mutate({ mutation: applyForMeetupMutation, variables: { meetupId } });
    }
    catch (error) {
        this.error = error;
    }
});

When('the user cancels attendance to the meetup', async function () {
    this.response = await this.client.mutate({ mutation: cancelMeetupAttendanceMutation, variables: { meetupId: this.meetup.id } });
});

When('the user cancels attendance to the meetup {string}', async function (name: string) {
    const meetupId = this.meetups.get(name);
    try {
        this.response = await this.client.mutate({ mutation: cancelMeetupAttendanceMutation, variables: { meetupId } });
    }
    catch (error) {
        this.error = error;
    }
});

Then('the user should receive successfull reservation with status {string} and role {string}', function (status: string, role: string) {
    const reservation = this.response.data.applyForMeetup;
    expect(reservation.status).to.be.equal(status);
    expect(reservation.role).to.be.equal(role);
});

Then('the user should receive his reservation with status {string}', function (status: string) {
    const reservation = this.response.data.cancelMeetupAttendance;
    expect(reservation.status).to.be.equal(status);    
});

Then('the user should be an attendee for the meetup {string}', async function (name: string) {
    const meetupId = this.meetups.get(name)
    const response = await this.client.query({ query: meetupByIdQuery, variables: { id: meetupId } });
    const meetup = response.data.meetup as Meetup;

    expect(meetup.attendees.some(
        (attendee) => attendee.user.email == this.signedInUserEmail
    )).to.be.true
});

Then('the user should see an error {string}', function (error: string) {
    expect(this.error.graphQLErrors[0].message).to.be.equal(error);
});