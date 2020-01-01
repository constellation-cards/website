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
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  // Query for markdown nodes to use in creating pages.
  // You can query for whatever data you want to create pages for e.g.
  // products, portfolio items, landing pages, etc.
  // Variables can be added as the second function parameter
  const {data, errors} = await graphql(`
    query MyQuery {
      allCardFace {
        edges {
          node {
            front {
              desc
              icons
              name
              prompts
              rule
            }
            back {
              desc
              icons
              name
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

  createPage({
    path: '/',
    component: path.resolve('src/components/front-page.js'),
    context: {
      cards
    }
  })

  cards.forEach(card => {
    const cardSlug = slug(card.front.name)
    console.log(cardSlug);
  })

  // TODO: create pages for each card
}