# V1 Implementation Plan

## Local development

For an initial desktop prototype, everything should be dockerised. The plan is to build it with react, vite, and tailwind css.

### User flow

- From the home-screen the user can select a "new game" (no history so no concept of an existing game)
- They input the names of all players
    - They can either enter names 1 by 1, with a UI that let's them type the $i$-th name then either let's them "add another player" or go to the "next" step
    - Or alternatively there should be "Quick options" in the top right:
        - It can remember (within a session) the list of names used in previous games, and give the option to re-use a previous list
        - The user has the option to paste in a csv of player names to avoid typing them all in
- After clicking next, they select a topic, from:
    - Singers
    - Places
    - Academic subjects
    - Any (a superset of all of the above)
    - etc., I'll add to this later
- The app quietly selects 1 player to be the traitor and 1 secret from the chosen topic. When choosing the secret it should be aware of secrets already used in this session and not re-use them. For each topic within this repo I will have defined (hardcoded) a list of options for secrets.
- The user can choose some options for the game:
    - How long should discussion be? (time in mins, default to 5)
    - Choose a new secret each round? 
- The app shuffles the list of players and then cycles through the names, where for each player $i$:
    - The screen shows player $i$'s name, and prompts them: "When you are ready, tap here to reveal your status"
    - When they tap, they are promoted: "Tap & hold the screen to reveal your status". This is on a new screen so they can't  accidentally tap in front of someone to reveal their status.
    - When the screen is tapped (& while the tap is held) their status pops up. If they are a traitor just says (You are a **Traitor**), if they are a faithful it says (You are a **Faithful**. The secret is _whatever_).
    - After they have tapped & held to reveal their status at least 1 time, they have the option to click "Pass to next player", or they can tap & hold again to continue to reveal their status
    - When they click "Pass to next player" the process repeats for player $i+1$
- Once all players are cycled through, the app prompts the players to go around in a circle and each ask 1 other player publicly a question, one at a time. There should be a button for "Questions asked and answered. Time for talk"
- When time for talk is clicked, there should be a timer. This should be set to however long discussion should be, and should dispay a countdown (including seconds)
- After the countdown there should be some form of notification (tbd what is allowed from a PWA on a phone)
- Players then vote for who they think the traitor is. On the app you can click a name (all names should be shown in a grid with 2 cols)
    - After a player is clicked there is the option to "reveal _Name's_ status", in practice this is more fun to do outloud, but for the sake of checking after the app should let you click this reveal prompt to see if they are a traitor a faithful
    - If they are a traitor, then game over
    - Otherwise we do another round
    - If the user specified they want a new secret each round then you need to again randomly cycle through players revealing privately their (unchanged) status and the new secret. 
    - Whoever was voted out in the last round is obviously excluded from this next round
- When the game ends there should be some end screen saying good game, the traitor/faithful won, and back to home

### Mobile optimisations for a PWA

- Homepage annimation with some play on the Traitors theme, logo, etc., customised
- Annimations between stages
- 

## Deployment in AWS

