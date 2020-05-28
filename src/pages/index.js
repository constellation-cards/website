import React from "react"
import { graphql, Link } from 'gatsby'
import slug from 'slug'
import Grid from '@material-ui/core/Grid';

import Layout from "../components/layout"
import SEO from "../components/seo"

import { assoc, groupBy, map, mergeDeepRight, nth, partition, pathOr } from 'ramda'

const upper = s => s.replace(/^\w/, c => c.toUpperCase())

// Return a Link element pointing to a given tag
const linkToTag = tag => <Link style={{"color": "inherit", "text-decoration": "inherit"}} to={`/tags/${slug(tag).toLowerCase()}`}>{upper(tag)}</Link>

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
    const Header = `h${(data.depth+1) * 2}`
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
  const formattedDepthCards = groupCardsByTagDepth(data.allCardFace.nodes, 0)
  return sequenceCardTree(formattedDepthCards, [])
}

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Grid container spacing={3}>
      <Grid item md={6}>
        {groupCardsByTag(data)}
      </Grid>
      <Grid md={6}>
        <h3>Articles and Background</h3>
        <ul>
          {map(node => (
            <li>
              <Link to={node.path}>{node.context.frontmatter.title}</Link>
            </li>
          ), data.allSitePage.nodes
          )}
        </ul>
      </Grid>
    </Grid>
  </Layout>
)

export default IndexPage

export const query = graphql`
query {
  allCardFace {
    nodes {
      name
      front {
        tags
      }
      back {
        tags
      }
    }
  }
  allSitePage(filter: {context: {frontmatter: {draft: {ne: true}, title: {glob: "*"}}}}, sort: {fields: context___frontmatter___title, order: ASC}) {
    nodes {
      path
      context {
        frontmatter {
          title
        }
      }
    }
  }
}
`
