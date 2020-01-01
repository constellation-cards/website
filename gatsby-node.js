const path = require('path')
const slug = require('slug')
const { pluck } = require('ramda')
const { getCardData } = require('./lib/card-data')

const cardMetadata = (id, card, contentDigest) => ({
  id,
  parent: null,
  children: [],
  front: card.front,
  back: card.back,
  internal: {
    type: 'CardFace',
    content: JSON.stringify(card),
    contentDigest
  }
})

exports.sourceNodes = ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  const allCards = getCardData('card-data')

  allCards.forEach(card => {
    createNode(cardMetadata(createNodeId(`front-${card.front.name}`), card, createContentDigest(card)))
  })
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const {data, errors} = await graphql(`
    query MyQuery {
      allCardFace {
        edges {
          node {
            front {
              name
              tags
              icons
              desc
              prompts
              rule
            }
            back {
              name
              tags
              icons
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

  cards.forEach(card => {
    const cardSlug = slug(card.front.name).toLowerCase()
    createPage({
      path: cardSlug,
      component: path.resolve('src/components/card.js'),
      context: {
        card
      }
    })
  })
}