import React from "react"
import { map } from "ramda"
import slug from "slug"

import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Grid from "@material-ui/core/Grid"

import CardFace from "../card-face"

const ClientCards = ({ cards, discardCard }) => (
  <Grid container spacing={3}>
    {map(
      card => (
        <>
          <Grid item xs={12}>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button onClick={() => discardCard(card)}>Discard</Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardFace
              side={card.front}
              href={`/cards/${slug(card.name).toLowerCase()}`}
              brand="Front"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardFace
              side={card.back}
              href={`/cards/${slug(card.name).toLowerCase()}`}
              brand="Back"
            />
          </Grid>
        </>
      ),
      cards
    )}
  </Grid>
)

export default ClientCards
