Feature: Attendance

    Background:
        Given the system has the following users:
            | name |
            | John |
            | Mike |
        And the system has the following events:
            | name    | owner |
            | Jumping | Mike  |        

    Scenario: User applies for a event
        Given the user is signed in as 'John'
        When the user applies for the event 'Jumping'
        Then the user should receive successfull reservation with status 'CONFIRMED' and role 'GUEST'
        And the user should be an attendee for the event 'Jumping'

    Scenario: User applies for a event they are already attending
        Given the user is signed in as 'John'
        And the user is an attendee at the event 'Jumping'
        When the user applies for the event 'Jumping'
        Then the user should see an error 'Already an attendee'

    Scenario: User cancels event attendance
        Given the user is signed in as 'John'
        And the user is an attendee at the event 'Jumping'
        When the user cancels attendance to the event 'Jumping'
        Then the user should receive his reservation with status 'CANCELED'