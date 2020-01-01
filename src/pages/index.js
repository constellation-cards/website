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
  const cardGroups = groupBy(pathOr('Core Cards', ['context', 'card', 'front', 'icons']), pluck('node', data.allSitePage.edges))
  return reduce(
    (a, icons) => append({
      icons,
      nodes: cardGroups[icons]
    }, a),
    [],
    keys(cardGroups)
  )
}

/*
    <ul>
    {data.allSitePage.edges.map((edge) => (
      
    ))}
    </ul>

 */

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    {map((cardGroup) => (
      <div>
        <h3>{cardGroup.icons}</h3>
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
              icons
            }
            back {
              name
              icons
            }
          }
        }
      }
    }
  }
}
`
