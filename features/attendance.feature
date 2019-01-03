Feature: Attendance

    Scenario: User applies for a meetup
        Given a signed in user
        And a meetup
        And the user is not an attendee at the meetup
        When the user applies for the meetup
        Then the user should be an attendee for the meetup
        And the attendance should be 'CONFIRMED'
    
    Scenario: User applies for a meetup they are already attending
        Given a signed in user
        And a meetup
        And the user is an attendee at the meetup
        When the user applies for the meetup
        Then the user should see an error 'Already an attendee'

    Scenario: User cancels meetup attendance
        Given a signed in user
        And a meetup
        And the user is an attendee at the meetup
        When the user cancels attendance to the meetup
        And the attendance should be 'CANCELED'