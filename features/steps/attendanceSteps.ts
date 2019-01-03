import { Given, When, Then } from "cucumber";
import { createMeetup } from "../fixtures";
import { expect } from 'chai';
import { MeetupAttendance, Meetup } from "../../src/types";
import { applyForMeetupMutation } from '../queries/applyForMeetupMutation';
import { meetupByIdQuery } from '../queries/meetupByIdQuery';
import { cancelMeetupAttendanceMutation } from '../queries/cancelMeetupAttendance';

Given(/^a meetup$/, async function () {
    this.meetup = await createMeetup(this.connection);
});

Given(/^the user is not an attendee at the meetup$/, async function () {
    const response = await this.client.query({query: meetupByIdQuery, variables: { id: this.meetup.id}});
    const meetup = (response.data as any).meetup as Meetup;
    expect(meetup.attendees.some((attendee) => attendee.user.id == this.userId)).to.be.false        
});

Given(/^the user is an attendee at the meetup$/, async function() {
    this.response = await this.client.mutate({ mutation: applyForMeetupMutation, variables: { meetupId: this.meetup.id } });
    // TODO: Should we assert here? We kinda have another scenario for this
});

When(/^the user applies for the meetup$/, async function () {
    try {
        this.response = await this.client.mutate({ mutation: applyForMeetupMutation, variables: { meetupId: this.meetup.id } });        
        this.error = undefined;
    }
    catch (error) {
        this.response = undefined;
        this.error = error;
    }
});

When('the user cancels attendance to the meetup', async function () {    
    this.response = await this.client.mutate({mutation: cancelMeetupAttendanceMutation, variables: { meetupId: this.meetup.id}});    
});

Then(/^the attendance should be '(.*)'$/, async function (status) {
    const response = await this.client.query({query: meetupByIdQuery, variables: { id: this.meetup.id}});
    const meetup = (response.data as any).meetup as Meetup;
    
    expect(meetup.attendees.some((attendee) => attendee.user.id == this.userId && attendee.status == status)).to.be.true        
});


Then(/^the user should be an attendee for the meetup$/, async function () {
    const response = await this.client.query({query: meetupByIdQuery, variables: { id: this.meetup.id}});
    const meetup = (response.data as any).meetup as Meetup;
    
    expect(meetup.attendees.some((attendee) => attendee.user.id == this.userId)).to.be.true        
});

Then(/^the user should see an error '(.*)'$/, function (error) {    
    expect(this.error.graphQLErrors[0].message).to.be.equal(error);
  });