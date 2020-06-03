const ejs = require("ejs")
const fs = require("fs")
const program = require("commander")

program
  .option("-s, --source-dir <dir>", "Source directory for YAML", "card-data")
  .option("-t, --tag <tag>", "Only show cards with a specific tag")

program.parse(process.argv)

const {
  filter,
  includes,
  isNil,
  join,
  map,
  prepend,
  propOr,
  reject,
} = require("ramda")

const { getCardData, iconForTag } = require("./lib/card-data")

const tagsToIcons = faceData => {
  return reject(isNil, map(iconForTag, faceData.tags))
}

async function writeCardAsTex(face, extraFlag) {
  const faceData = {
    name: propOr("", "name", face),
    tags: prepend(extraFlag, propOr([], "tags", face)),
    img: iconForTag(propOr("", "iconImg", face)) || propOr("", "img", face),
    desc: propOr("", "desc", face),
    prompts: propOr([], "prompts", face),
    rule: propOr("", "rule", face),
  }
  const icons = tagsToIcons(faceData)
  const tmpl = await ejs.renderFile(
    "card-face.tex.ejs",
    { ...faceData, icons },
    { async: true }
  )
  return tmpl
}

function filterCards(options, allCards) {
  if (options.tag) {
    const incl = includes(options.tag)
    return filter(
      card => incl(card.front.tags || []) || incl(card.back.tags || []),
      allCards
    )
  } else {
    return allCards
  }
}

function simplifyCardFace(face) {
  const prompts = map(prompt => `- ${prompt}\n`, face.prompts || [])
  return {
    name: face.name,
    desc: `${face.desc}\n${join('', prompts)}\n${face.rule}`
  }
}

async function outputCards(options) {
  const allCards = getCardData(options.sourceDir)
  let printedCards = []
  let webCards = []
  const filteredCards = filterCards(options, allCards)
  for (let card of filteredCards) {
    const frontFace = await writeCardAsTex(card.front, "front")
    const backFace = await writeCardAsTex(card.back, "back")
    for(let i = 0; i < (card.qty || 1); i++) {
      printedCards.unshift(backFace)
      printedCards.push(frontFace)
      webCards.push(frontFace)
      webCards.push(backFace)  
    }
  }
  const printedCardsTmpl = await ejs.renderFile(
    "cards.tex.ejs",
    { cards: printedCards },
    { async: true }
  )
  const webCardsTmpl = await ejs.renderFile(
    "cards.tex.ejs",
    { cards: webCards },
    { async: true }
  )
  fs.writeFileSync("cards-print.tex", printedCardsTmpl)
  fs.writeFileSync("cards.tex", webCardsTmpl)

  const simplifiedCards = map(card => (JSON.stringify({
    front: simplifyCardFace(card.front),
    back: simplifyCardFace(card.back)
  })), filteredCards)
  fs.writeFileSync("cards.json", `[\n${join('\n,', simplifiedCards)}\n]`)
}

outputCards(program).catch(console.error)
