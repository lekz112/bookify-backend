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

    Scenario: Canceling created Meetup
        Given a signed in user
        When the user creates a meetup called 'MyMeetup'
        And the user cancels the meetup called 'MyMeetup'
        Then the meetup should be caneceled