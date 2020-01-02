import React from "react"
import { graphql, Link } from 'gatsby'

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import slug from 'slug'

import Layout from "../components/layout"
import SEO from "../components/seo"

import { append, groupBy, keys, map, pluck, pathOr, reduce } from 'ramda'

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

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Container>
      <Row>
        <Col sm={6}>
          {map((cardGroup) => (
            <div>
              <h3>
                <Link style={{"color": "inherit", "text-decoration": "inherit"}} to={`/tags/${slug(cardGroup.tag).toLowerCase()}`}>{cardGroup.tag}</Link>
              </h3>
              <ul>
                {map(node => (
                  <li>
                    <Link to={node.path}>{node.context.card.name}</Link>
                  </li>
                ), cardGroup.nodes)}
              </ul>
              <pre>{JSON.stringify(cardGroup.cards)}</pre>
            </div>
          ), groupedCards(data))}

        </Col>
        <Col sm={6}>
          <h3>Articles and Background</h3>
          <ul>
            <li><Link to="/using-conditions">Using Conditions</Link></li>
          </ul>
        </Col>
      </Row>
    </Container>
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
            name
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
