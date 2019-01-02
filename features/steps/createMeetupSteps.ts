import { expect } from 'chai';
import { Then, When, After } from "cucumber";
import { CreateMeetupMutation } from '../queries/createMeetupMutation';

When(/^the user creates a meetup with following details:$/, async function(dataTable) {            
    this.response = await this.client.mutate({ mutation: CreateMeetupMutation, variables: { name: dataTable.rowsHash().name }});
});

Then(/^the system should create a meetup with following details:$/, function(dataTable) {
    expect(this.response.data.createMeetup.name).to.be.equal(dataTable.rowsHash().name);
});

Then(/^the user should be the owner of this meetup$/, function() {    
    expect(this.response.data.createMeetup.attendees[0].role).to.be.equal('OWNER');
    expect(this.response.data.createMeetup.attendees[0].user.id).to.be.equal(this.userId);
});