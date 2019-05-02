Feature: Meetup

Background:
        Given the system has the following users:
            | email         | password |
            | john@doe.de   | johndoe  |                    
        And the user is signed in as 'john@doe.de'

    Scenario: Creating a Meetup        
        When the user creates a meetup called 'MyMeetup'
        Then the meetup called 'MyMeetup' should be created
        And the user should be the owner of the meetup

    Scenario: Fetching a newly created Meetup        
        When the user creates a meetup called 'MyMeetup'
        And the user fetches list of meetups
        Then the user should see meetup called 'MyMeetup' in the list             

    Scenario: Canceling created Meetup        
        When the user creates a meetup called 'MyMeetup'
        And the user cancels the meetup called 'MyMeetup'
        Then the meetup should be caneceled