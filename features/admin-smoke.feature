Feature: Admin smoke test

  Scenario: Default admin can sign in and create a note
    Given the emulators are running with no existing accounts
    And the web app is running on http://localhost:3000
    When I navigate to http://localhost:3000
    Then I should see the login page with a "Sign In with Google" button

    When I click "Sign In with Google"
    Then the Auth Emulator login widget should open
    And it should show "No Google.com accounts exist in the Auth Emulator."

    When I click "Add new account"
    And I fill in the email with "admin@example.com"
    And I fill in the display name with "Admin"
    And I click "Sign in with Google.com"
    Then I should be redirected to "/notebook"

    When I click "create note"
    Then a new "untitled" note should appear in the note list
    And the note editor should be active

    When I type "Hello from the smoke test" in the note editor
    Then the note title in the list should update to "Hello from the smoke test"
    And the note's "Updated" timestamp should be recent
