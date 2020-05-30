import React from "react"
import { map } from 'ramda'
import slug from 'slug'

import Grid from '@material-ui/core/Grid'

// TODO: redo as two-column container

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const CardPage = ({ pageContext: { title, description, cards } }) => (
  <Layout>
    <SEO title={title} description={description} />
    <Grid container spacing={3}>
      {map(card => (
        <>
          <Grid item xs={12} md={6}>
            <CardFace side={card.front} href={`/cards/${slug(card.name).toLowerCase()}`} brand="Front" />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardFace side={card.back} href={`/cards/${slug(card.name).toLowerCase()}`} brand="Back" />
          </Grid>
        </>
      ), cards)}
    </Grid>
  </Layout>
)

export default CardPage
