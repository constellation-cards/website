import React from "react"
import loadable from '@loadable/component'

import { clone, concat, groupBy, join, map, reduce, repeat } from 'ramda'

import Layout from "../components/layout"
import SEO from "../components/seo"

const PlayClient = loadable(() => import("./play-client"))

// TODO: uncomment when we support unique cards
const explodeStack = stack => reduce((a, v) => concat(a, repeat(v, /* v.qty || */ 1)), [], clone(stack))

/**
 * Given an array of cards,
 * sort them into a key => [cards] map,
 * where "key" is "tag/tag".
 * Expand cards by quantity
 * @param {*} cards 
 */
const sortCardsIntoStacks = cards => {
  const cardsByTag = groupBy(card => join('/', card.front.tags), cards);
  const cardsWithQty = map(explodeStack, cardsByTag)
  return cardsWithQty;
}

const PlayPage = ({ pageContext: { title, description, cards } }) => (
  <Layout>
    <SEO title={title} description={description} />
    <PlayClient stacks={sortCardsIntoStacks(cards)} />
  </Layout>
)

export default PlayPage
