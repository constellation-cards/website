import React from "react"
import { map } from 'ramda'

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const CardPage = ({pageContext: {title, cards}}) => (
  <Layout>
    <SEO title={title} />
    {map(card => (
      <div>
        <CardFace side={card.front} brand="Front" />
        <CardFace side={card.back} brand="Back" />
      </div>
    ), cards)}
  </Layout>
)

export default CardPage
