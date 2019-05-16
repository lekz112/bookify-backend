Feature: Attendance

    Background:
        Given the system has the following users:
            | email         | password |
            | john@doe.de   | johndoe  |
            | mike@mike.com | mikemike |
        And the system has the following events:
            | name    | owner         |
            | Jumping | mike@mike.com |
        And the user is signed in as 'john@doe.de'

    Scenario: User applies for a event
        When the user applies for the event 'Jumping'
        Then the user should receive successfull reservation with status 'CONFIRMED' and role 'GUEST'
        And the user should be an attendee for the event 'Jumping'        

    Scenario: User applies for a event they are already attending
        Given the user is an attendee at the event 'Jumping'
        When the user applies for the event 'Jumping'
        Then the user should see an error 'Already an attendee'

    Scenario: User cancels event attendance
        And the user is an attendee at the event 'Jumping'
        When the user cancels attendance to the event 'Jumping'
        Then the user should receive his reservation with status 'CANCELED'