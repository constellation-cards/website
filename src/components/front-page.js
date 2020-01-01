import React from "react"
import { graphql, Link } from 'gatsby'

import Layout from "../components/layout"
import SEO from "../components/seo"

const cardName = edge => {
  const frontName = edge.node.context.card.front.name
  const backName = edge.node.context.card.back.name
  return (frontName === backName) ? frontName : `${frontName} / ${backName}`
}

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <ul>
    {data.allSitePage.edges.map((edge) => (
      <li>
        <Link to={edge.node.path}>{cardName(edge)}</Link>
      </li>
    ))}
    </ul>
  </Layout>
)

export default IndexPage

export const query = graphql`
query MyQuery {
  allSitePage(filter: {context: {card: {front: {name: {glob: "*"}}}}}) {
    edges {
      node {
        path
        context {
          card {
            front {
              name
            }
            back {
              name
            }
          }
        }
      }
    }
  }
}
`
