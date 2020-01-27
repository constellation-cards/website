const fs = require('fs')

const { join, map, prepend, propOr } = require('ramda')

const { getCardData } = require('./lib/card-data')

function faceDataToTex(faceData) {
  const text = []
  if (faceData.name) {
    text.push(`\\section{${faceData.name}}`)
  }
  if (faceData.desc) {
    text.push(`{\\cardbodyfont`)
    for (let line of faceData.desc.split('\n')) {
      text.push(`${line.trim()}\\par`)
    }
    text.push(`}`)
  }
  if (faceData.prompts.length > 0) {
    text.push(`{\\cardpromptfont`)
    text.push('\\begin{itemize}')
    text.push('\\tightlist')
    for (let prompt of faceData.prompts) {
      text.push(`\\item[-] ${prompt}`)
    }
    text.push('\\end{itemize}')
    text.push(`}`)
  }
  if (faceData.rule) {
    text.push('\\vspace*{\\fill}')
    text.push('{\\cardrulefont\\center\\emph')
    text.push(`${faceData.rule}\\par`)
    text.push(`}`)
  }
  text.push(`\\clearpage`)
  return join('', map(s => `${s}\n`, text))
}

function writeCardAsTex(face, extraFlag) {
  const faceData = {
    name: propOr('', 'name', face),
    tags: prepend(extraFlag, propOr([], 'tags', face)),
    img: propOr('', 'img', face),
    desc: propOr('', 'desc', face),
    prompts: propOr([], 'prompts', face),
    rule: propOr('', 'rule', face)
  }
  const includeName = Math.random().toString(36).substring(2, 15)
  fs.writeFileSync(`${includeName}.tex`, faceDataToTex(faceData))
  return includeName
}

async function outputCards(sourcedir) {
  const allCards = getCardData(sourcedir);
  let printedCards = [];
  allCards.forEach(card => {
    // printedCards.unshift(writeCardAsTex(card.back, 'back'));
    printedCards.push(writeCardAsTex(card.front, 'front'));
    // Comment this and uncomment unshift to get print order
    printedCards.push(writeCardAsTex(card.back, 'back'));
  });
  fs.writeFileSync('allcards.tex', join('\n', map(includeName => `\\input{${includeName}}`, printedCards)))
  fs.writeFileSync('cleanup-cards.sh', join('\n', map(includeName => `rm ${includeName}.tex`, printedCards)))
}

outputCards('card-data').catch(console.error)
