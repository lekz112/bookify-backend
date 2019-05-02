Feature: Attendance

    Background:
        Given the system has the following users:
            | email         | password |
            | john@doe.de   | johndoe  |
            | mike@mike.com | mikemike |
        And the system has the following meetups:
            | name    | owner         |
            | Jumping | mike@mike.com |
        And the user is signed in as 'john@doe.de'

    Scenario: User applies for a meetup
        When the user applies for the meetup 'Jumping'
        Then the user should receive successfull reservation with status 'CONFIRMED' and role 'GUEST'
        And the user should be an attendee for the meetup 'Jumping'        

    Scenario: User applies for a meetup they are already attending
        Given the user is an attendee at the meetup 'Jumping'
        When the user applies for the meetup 'Jumping'
        Then the user should see an error 'Already an attendee'

    Scenario: User cancels meetup attendance
        And the user is an attendee at the meetup 'Jumping'
        When the user cancels attendance to the meetup 'Jumping'
        Then the user should receive his reservation with status 'CANCELED'