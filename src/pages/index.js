import React from "react"
import { graphql, Link } from "gatsby"
import slug from "slug"
import Grid from "@material-ui/core/Grid"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Layout from "../components/layout"
import SEO from "../components/seo"

import {
  assoc,
  groupBy,
  join,
  last,
  map,
  mergeDeepRight,
  nth,
  partition,
  pathOr,
} from "ramda"

const upper = s => s.replace(/^\w/, c => c.toUpperCase())

const tagLinkStyle = {
  color: "inherit",
  textDecoration: "inherit",
}

// Return a Link element pointing to a given tag
const linkToTag = keypath => (
  <Link style={tagLinkStyle} to={`/tags/${slug(last(keypath)).toLowerCase()}`}>
    {join(" / ", map(upper, keypath))}
  </Link>
)

const groupCards = (cards, depth, side) =>
  groupBy(card => nth(depth, pathOr([], [side, "tags"], card)), cards)

const cardHasMoreTags = (card, nextDepth) =>
  pathOr(0, ["front", "tags", "length"], card) > nextDepth ||
  pathOr(0, ["front", "tags", "length"], card) > nextDepth

const groupCardsByTagDepth = (cards, depth) => {
  const depthCards = mergeDeepRight(
    groupCards(cards, depth, "front"),
    groupCards(cards, depth, "back")
  )
  const formattedDepthCards = map(cardList => {
    const nextDepth = depth + 1
    const [childCards, newCardList] = partition(
      card => cardHasMoreTags(card, nextDepth),
      cardList
    )
    let newContent = {
      depth,
      cardList: newCardList,
    }
    if (childCards) {
      newContent = assoc(
        "children",
        groupCardsByTagDepth(childCards, nextDepth),
        newContent
      )
    }
    return newContent
  }, depthCards)
  return formattedDepthCards
}

const sequenceCardTree = (
  formattedDepthCards,
  currentSequence,
  currentKeys = []
) => {
  const sortedKeys = [...Object.keys(formattedDepthCards)].sort()
  for (let key of sortedKeys) {
    let keypath = [...currentKeys, key]
    const data = formattedDepthCards[key]
    if (data.cardList && data.cardList.length > 0) {
      currentSequence.push()
      currentSequence.push(
        <Grid item md={3}>
          <h3>{linkToTag(keypath)}</h3>
          <List dense>
          {map(card => (
            <ListItem button component={Link} to={`/cards/${slug(card.name).toLowerCase()}`}>
              <ListItemText primary={card.name} />
            </ListItem>
          ), data.cardList)}
          </List>
        </Grid>
      )
    }
    if (data.children) {
      currentSequence = sequenceCardTree(
        data.children,
        currentSequence,
        keypath
      )
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
      {groupCardsByTag(data)}
    </Grid>
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allCardFace {
      nodes {
        name
        qty
        front {
          tags
        }
        back {
          tags
        }
      }
    }
  }
`
