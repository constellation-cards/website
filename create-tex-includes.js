const ejs = require('ejs')
const fs = require('fs')

const { isNil, map, prepend, propOr, reject } = require('ramda')

const { getCardData, iconForTag } = require('./lib/card-data')

const tagsToIcons = faceData => {
  return reject(isNil, map(iconForTag, faceData.tags))
}

async function writeCardAsTex(face, extraFlag) {
    const faceData = {
    name: propOr('', 'name', face),
    tags: prepend(extraFlag, propOr([], 'tags', face)),
    img: iconForTag(propOr('', 'iconImg', face)) || propOr('', 'img', face),
    desc: propOr('', 'desc', face),
    prompts: propOr([], 'prompts', face),
    rule: propOr('', 'rule', face)
  }
  const icons = tagsToIcons(faceData)
  const tmpl = await ejs.renderFile('card-face.tex.ejs', {...faceData, icons}, {async: true})
  return tmpl
}

async function outputCards(sourcedir) {
  const allCards = getCardData(sourcedir);
  let printedCards = [];
  let webCards = [];
  for (let card of allCards) {
    const frontFace = await writeCardAsTex(card.front, 'front')
    const backFace = await writeCardAsTex(card.back, 'back')
    printedCards.unshift(backFace);
    printedCards.push(frontFace);
    webCards.push(frontFace);
    webCards.push(backFace);
  }
  const printedCardsTmpl = await ejs.renderFile('cards.tex.ejs', {cards: printedCards}, {async: true})
  const webCardsTmpl = await ejs.renderFile('cards.tex.ejs', {cards: webCards}, {async: true})
  fs.writeFileSync('cards-print.tex', printedCardsTmpl)
  fs.writeFileSync('cards.tex', webCardsTmpl)
}

outputCards('card-data').catch(console.error)
