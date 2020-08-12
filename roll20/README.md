To use these files:

1. Create a new Roll20 game
2. Specify a "Custom" character sheet
3. Paste the HTML and CSS files into the game settings
4. Create a new API file containing the JS file
5. Launch the game
6. Create a new handout called "cards.json" (all one word, lowercase)
7. Open https://constellation.cards/cards.json
8. Paste the contents of this file into the "cards.json" handout

To play, you have three commands:

`!deal <player name> <card name>` - deals a specific card by name into a character sheet

`!dealone <player name> <card tag>` - picks a random card from all cards with a given tag and deals it into a sheet

`!dealall <player name> <card tag>` - deals all cards of a given type into a sheet

### Specific examples

All examples assume a character sheet has already been created with the appropriate name.

#### Create a reference sheet

`!dealall Conditions condition` - adds all condition cards to a sheet called 'Conditions', letting players reference them if necessary

### Create a random character

```
!dealone Character upbringing
!dealone Character role
!dealone Character focus
```

This creates a character at random, by picking one character card from each of three categories.

### Create a new encounter

```
!dealone Encounter encounter
!dealone Encounter encounter
!dealone Encounter emotion
```

This deals two random encounter cards, and one emotion card.