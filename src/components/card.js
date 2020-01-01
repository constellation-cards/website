import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const CardPage = ({pageContext: {card}}) => (
  <Layout>
    <SEO title={card.front.name} />
    <CardFace side={card.front} brand="Front" />
    <CardFace side={card.back} brand="Back" />
  </Layout>
)

export default CardPage
