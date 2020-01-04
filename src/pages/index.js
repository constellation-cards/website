import React from "react"
import { graphql, Link } from 'gatsby'

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import slug from 'slug'

import Layout from "../components/layout"
import SEO from "../components/seo"

import { assoc, groupBy, map, mergeDeepRight, nth, partition, pipe, pluck, pathOr } from 'ramda'

// Return a Link element pointing to a given tag
const linkToTag = tag => <Link style={{"color": "inherit", "text-decoration": "inherit"}} to={`/tags/${slug(tag).toLowerCase()}`}>{tag}</Link>

// Return a Link element pointing to an individual card, loaded from GraphQL
const linkToCard = card => <Link to={`/cards/${slug(card.name).toLowerCase()}`}>{card.name}</Link>

const groupCards = (cards, depth, side) => groupBy(card => nth(depth, pathOr([], [side, 'tags'], card)), cards)

const cardHasMoreTags = (card, nextDepth) => (pathOr(0, ['front', 'tags', 'length'], card) > nextDepth || pathOr(0, ['front', 'tags', 'length'], card) > nextDepth)

const groupCardsByTagDepth = (cards, depth) => {
  const depthCards = mergeDeepRight(groupCards(cards, depth, 'front'), groupCards(cards, depth, 'back'))
  const formattedDepthCards = map(cardList => {
    const nextDepth = depth + 1
    const [childCards, newCardList] = partition(card => cardHasMoreTags(card, nextDepth), cardList)
    let newContent = {
      depth,
      cardList: newCardList
    }
    if (childCards) {
      newContent = assoc('children', groupCardsByTagDepth(childCards, nextDepth), newContent)
    }
    return newContent
  }, depthCards)
  return formattedDepthCards
}

const sequenceCardTree = (formattedDepthCards, currentSequence) => {
  const sortedKeys = [...Object.keys(formattedDepthCards)].sort()
  for (let key of sortedKeys) {
    const data = formattedDepthCards[key]
    const Header = `h${(data.depth+2)}`
    currentSequence.push(<Header>{linkToTag(key)}</Header>)
    currentSequence.push((
      <ul>
        {map(card => <li>{linkToCard(card)}</li>, data.cardList)}
      </ul>
    ))
    if (data.children) {
      currentSequence = sequenceCardTree(data.children, currentSequence)
    }
  }
  return currentSequence
}

const groupCardsByTag = data => {
  const cards = pipe(
    pluck('node'),
    pluck('context'),
    pluck('card')
  )(data.allSitePage.edges)
  const formattedDepthCards = groupCardsByTagDepth(cards, 0)
  return sequenceCardTree(formattedDepthCards, [])
}

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Container>
      <Row>
        <Col sm={6}>
          <pre>
            {groupCardsByTag(data)}
          </pre>
        </Col>
        <Col sm={6}>
          <h3>Articles and Background</h3>
          <ul>
            <li><Link to="/using-conditions">Using Conditions</Link></li>
            <li><Link to="/playing-the-dreamer">Playing the Dreamer</Link></li>
            <li><Link to="/playing-the-soldier">Playing the Soldier</Link></li>
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