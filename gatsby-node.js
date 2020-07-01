const path = require('path')
const slug = require('slug')
const { concat, filter, includes, map, pathOr, pluck, uniq, unnest } = require('ramda')
const { getCardData } = require('./lib/card-data')

const cardMetadata = (createNodeId, card, contentDigest) => {
  const name = (card.front.name === card.back.name) ? card.front.name : `${card.front.name} / ${card.back.name}`
  return ({
    id: createNodeId(name),
    parent: null,
    children: [],
    name,
    qty: card.qty || 1,
    front: card.front,
    back: card.back,
    internal: {
      type: 'CardFace',
      content: JSON.stringify(card),
      contentDigest
    }
  })
}

exports.sourceNodes = ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  const allCards = getCardData('card-data')

  allCards.forEach(card => {
    createNode(cardMetadata(createNodeId, card, createContentDigest(card)))
  })
}

function allCardsWithTag(tag, cards) {
  return filter(card => includes(tag, pathOr([], ['front', 'tags'], card)) || includes(tag, pathOr([], ['back', 'tags'], card)), cards)
}

function allTags(cards) {
  const getTags = side => unnest(map(card => pathOr([], [side, 'tags'], card), cards))
  return uniq(
    concat(
      getTags('front'), getTags('back')
    )
  )
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const { data, errors } = await graphql(`
    query MyQuery {
      allCardFace {
        edges {
          node {
            name
            qty
            front {
              name
              tags
              desc
              prompts
              rule
            }
            back {
              name
              tags
              desc
              prompts
              rule
            }
          }
        }
      }
    }
  `)
  if (errors) {
    throw errors
  }

  const cards = pluck('node', data.allCardFace.edges)
  const tags = allTags(cards)

  createPage({
    path: '/all-cards',
    component: path.resolve('src/components/card.js'),
    context: {
      title: `All Cards`,
      description: 'A full listing of all cards',
      cards
    }
  })

  tags.forEach(tag => {
    const tagSlug = `tags/${slug(tag).toLowerCase()}`
    createPage({
      path: tagSlug,
      component: path.resolve('src/components/card.js'),
      context: {
        title: `All ${tag} cards`,
        description: 'A full listing of cards under this tag',
        cards: allCardsWithTag(tag, cards)
      }
    })
  })

  cards.forEach(card => {
    const cardSlug = `cards/${slug(card.name).toLowerCase()}`
    createPage({
      path: cardSlug,
      component: path.resolve('src/components/card.js'),
      context: {
        title: card.name,
        description: card.front.desc,
        cards: [card]
      }
    })
  })
}