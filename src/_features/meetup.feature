Feature: Event

Background:
        Given the system has the following users:
            | email         | password |
            | john@doe.de   | johndoe  |                    
        And the user is signed in as 'john@doe.de'

    Scenario: Creating a Event        
        When the user creates a event called 'MyEvent'
        Then the event called 'MyEvent' should be created
        And the user should be the owner of the event

    Scenario: Fetching a newly created Event        
        When the user creates a event called 'MyEvent'
        And the user fetches list of events
        Then the user should see event called 'MyEvent' in the list             

    Scenario: Canceling created Event        
        When the user creates a event called 'MyEvent'
        And the user cancels the event called 'MyEvent'
        Then the event should be caneceled