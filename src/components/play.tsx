import React from "react"
import loadable from '@loadable/component'

import { clone, concat, groupBy, join, map, reduce, repeat } from 'ramda'

import Layout from "./layout"
import SEO from "./seo"

const PlayClient = loadable(() => import("./play-client"))

import { Card, Stack, Stacks } from "./play-client"

const randomId = (): string => {
  return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

/**
 * Return a collection of cards such that the collection has (card.qty) number of each cards.
 * Quantity defaults to 1.
 * Also assign each card a randomized ID.
 * @param stack a stack of cards
 */
const explodeStack = (stack: Stack): Stack => {
  const cardsWithQuantity = reduce((a: Stack, v: Card) => concat(a, repeat(v, v.qty || 1)), [], clone(stack))
  const cardsWithIds = map((card: Card) => ({...card, id: randomId()}), cardsWithQuantity)
  return cardsWithIds
}

/**
 * Given an array of cards,
 * sort them into a key => [cards] map,
 * where "key" is "tag/tag".
 * Expand cards by quantity
 * @param {*} cards 
 */
const sortCardsIntoStacks = (cards: Stack): Stacks => {
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
