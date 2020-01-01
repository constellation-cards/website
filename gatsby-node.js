const { getCardData } = require('./lib/card-data')

const cardMetadata = (id, card, contentDigest) => ({
  id,
  parent: null,
  children: [],
  card,
  internal: {
    type: 'CardFace',
    content: JSON.stringify(card),
    contentDigest
  }
})

exports.sourceNodes = ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  const allCards = getCardData('card-data')

  allCards.forEach(card => {
    createNode(cardMetadata(createNodeId(`front-${card.front.name}`), card.front, createContentDigest(card.front)))
    createNode(cardMetadata(createNodeId(`back-${card.back.name}`), card.back, createContentDigest(card.back)))
  })
}