import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "./card-face"

const IndexPage = ({pageContext: {cards}}) => (
  <Layout>
    <SEO title="Home" />
    {cards.map(card => (
      <div>
        <CardFace side={card.front} brand="Front" />
        <CardFace side={card.back} brand="Back" />
      </div>
    ))}
  </Layout>
)

export default IndexPage
