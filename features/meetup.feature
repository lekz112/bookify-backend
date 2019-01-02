Feature: Meetup

    Scenario: Creating a Meetup
        Given a signed in user with id '554234aa-0cd3-11e9-a7f2-186590d6d39d'
        When the user creates a meetup with following details:
            | name | meetup |
        Then the system should create a meetup with following details:
            | name | meetup |
        And the user should be the owner of this meetup            

    Scenario: Creating and fetching a Meetup
        Given a signed in user with id '554234aa-0cd3-11e9-a7f2-186590d6d39d'
        When the user creates a meetup with following details:
            | name | meetup |
        And the user fetches list of meetups
        Then the system should should respond with a singe meetup with following details:
            | name | meetup |                     
        And the user should be the owner of this meetup
             