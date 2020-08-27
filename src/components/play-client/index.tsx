import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow"

import { identity, map, sortBy, without } from "ramda"
import ClientCards from "./client-card"
import ClientCardDrawer from "./client-card-drawer"
import StackList from "./stack-list"

import { concat } from "ramda"

export type Card = any // TODO: better signature

export type Stack = Card[]

export type Stacks = Record<string, Stack>

interface PlayState {
  allCardsIsOpen: boolean
  cards: Card[]
}

type SetStateFunction = Function // TODO: better signature

// Return a random element from an array
const sample = items => items[Math.floor(Math.random() * items.length)]

const newCharacter = (
  stacks: Stacks,
  state: PlayState,
  setState: SetStateFunction
) => {
  const newCards = [
    sample(stacks["character/upbringing"]),
    sample(stacks["character/role"]),
    sample(stacks["character/focus"]),
  ]
  setState({ ...state, cards: newCards })
}

const newEncounter = (
  stacks: Stacks,
  state: PlayState,
  setState: SetStateFunction
) => {
  const newCards = [
    sample(stacks["encounter"]),
    sample(stacks["encounter"]),
    sample(stacks["oracle/emotion"]),
  ]
  setState({ ...state, cards: newCards })
}

const toggleAllCards = (
  state: PlayState,
  setState: SetStateFunction
) => allCardsIsOpen => {
  setState({ ...state, allCardsIsOpen })
}

const CardPage = ({ stacks }: { stacks: Stacks }) => {
  const [state, setState]: [PlayState, SetStateFunction] = useState({
    allCardsIsOpen: false,
    cards: [],
  })

  const drawerCallback = toggleAllCards(state, setState)

  const dealStackAction = (stackName: string) => () => {
    const stack = stacks[stackName]
    const newCards = concat(state.cards, [sample(stack)])
    setState({ ...state, cards: newCards })
  }

  const dealCardAction = (card: Card) => () => {
    const newCards = concat(state.cards, [card])
    setState({ ...state, cards: newCards })
  }

  const discardAction = (card: Card) => () => {
    const newCards = without([card], state.cards)
    setState({ ...state, cards: newCards })
  } 

  return (
    <>
      <ClientCardDrawer
        allCardsIsOpen={state.allCardsIsOpen}
        drawerCallback={drawerCallback}
      >
        <List dense={false}>
          {map(
            stackName => (
              <StackList stacks={stacks} stackName={stackName} dealStackAction={dealStackAction} dealCardAction={dealCardAction} />
            ),
            sortBy(identity, Object.keys(stacks))
          )}
        </List>
      </ClientCardDrawer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ButtonGroup
            variant="contained"
            color="secondary"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => drawerCallback(true)}>All Cards</Button>
            <Button onClick={() => newCharacter(stacks, state, setState)}>
              New Character
            </Button>
            <Button onClick={() => newEncounter(stacks, state, setState)}>
              New Encounter
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <ClientCards
            cards={state.cards}
            discardAction={discardAction}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CardPage
