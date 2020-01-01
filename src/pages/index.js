import React from "react"
import { graphql, Link } from 'gatsby'

import Layout from "../components/layout"
import SEO from "../components/seo"

import { append, groupBy, keys, map, pluck, pathOr, reduce } from 'ramda'

const cardName = node => {
  const frontName = node.context.card.front.name
  const backName = node.context.card.back.name
  return (frontName === backName) ? frontName : `${frontName} / ${backName}`
}

const groupedCards = data => {
  const cardGroups = groupBy(edge => pathOr(['no tags'], ['context', 'card', 'front', 'tags'], edge)[0], pluck('node', data.allSitePage.edges))
  return reduce(
    (a, tag) => append({
      tag,
      nodes: cardGroups[tag]
    }, a),
    [],
    keys(cardGroups)
  )
}

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    {map((cardGroup) => (
      <div>
        <h3>{cardGroup.tag}</h3>
        <ul>
          {map(node => (
            <li>
              <Link to={node.path}>{cardName(node)}</Link>
            </li>
          ), cardGroup.nodes)}
        </ul>
        <pre>{JSON.stringify(cardGroup.cards)}</pre>
      </div>
    ), groupedCards(data))}
  </Layout>
)

export default IndexPage

export const query = graphql`
query AllCardPages {
  allSitePage(filter: {context: {card: {front: {name: {glob: "*"}}}}}) {
    edges {
      node {
        path
        context {
          card {
            front {
              name
              tags
              icons
            }
            back {
              name
              tags
              icons
            }
          }
        }
      }
    }
  }
}
`
