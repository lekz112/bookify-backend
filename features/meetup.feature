Feature: Meetup

    Scenario: Creating a Meetup
        Given a signed in user
        When the user creates a meetup called 'MyMeetup'
        Then the meetup called 'MyMeetup' should be created
        And the user should be the owner of the meetup

    Scenario: Fetching a newly created Meetup
        Given a signed in user
        When the user creates a meetup called 'MyMeetup'
        And the user fetches list of meetups
        Then the user should see meetup called 'MyMeetup' in the list             

    Scenario: Canceling Meetup where user is the owner
        Given a signed in user
        And a meetup where the user have the role of 'OWNER'
        When the user cancels the meetup
        Then the meetup should have the status 'CANCELED'

    Scenario: Canceling Meetup where user is guest
        Given a signed in user
        And a meetup where the user have the role of 'GUEST'
        When the user cancels the meetup
        Then the system should respond with an error