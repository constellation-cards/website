import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import SEO from "../components/seo"

import CardFace from "../components/card-face"

const AllCardsPage = ({ data }) => (
  <Layout>
    <SEO title="All Cards" />
    {data.allCardFace.edges.map((edge) => (
      <div>
        <CardFace side={edge.node.front} brand="Front" />
        <CardFace side={edge.node.back} brand="Back" />
      </div>
    ))}
  </Layout>
)

export default AllCardsPage

export const query = graphql`
query AllCards {
  allCardFace {
    edges {
      node {
        front {
          name
          tags
          icons
          desc
          prompts
          rule
        }
        back {
          name
          tags
          icons
          desc
          prompts
          rule
        }
      }
    }
  }
}
`
