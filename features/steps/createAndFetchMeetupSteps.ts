import { expect } from 'chai';
import { Then, When, After } from "cucumber";
import { MeetupsQuery } from '../queries/meetupsQuery';
import * as util from 'util' // has no default export

When(/^the user fetches list of meetups/, async function() {
    this.response = await this.client.query({query: MeetupsQuery});
});

Then(/^the system should should respond with a singe meetup with following details:/, function(dataTable) {
    expect(this.response.data.meetups).to.have.lengthOf(1);    
    expect(this.response.data.meetups[0].name).to.be.equal(dataTable.rowsHash().name);
});

Then(/^the user should be the owner of this meetup$/, function() {    
    expect(this.response.data.meetups[0].attendees[0].role).to.be.equal('OWNER');
    expect(this.response.data.meetups[0].attendees[0].user.id).to.be.equal(this.userId);
});