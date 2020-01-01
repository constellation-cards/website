const escapeHtml = require('escape-html'),
      yaml = require('js-yaml');

const { join, map, split } = require('ramda');

const { getCardData } = require('./lib/card-data');

/**
 * Create and return a CSV writer.
 * @param {*} filename 
 */
const createWriter = filename => {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      {id: 'num', title: 'Num'},
      {id: 'icons', title: 'Icons'},
      {id: 'name', title: 'Name'},
      {id: 'img', title: 'Img'},
      {id: 'desc', title: 'Desc'},
      {id: 'prompts', title: 'Prompts'},
      {id: 'rule', title: 'Rule'}
    ]
  });
  return csvWriter;  
}

/**
 * Turn card data (front or back) into columns for CSV
 * @param {*} card 
 * @param {*} extraIcons 
 */
function cardToColumn(card, extraIcons = "") {
  return ({
    num: (parseInt(card.num) || 1),
    icons: `${extraIcons}${card.icons || ''}`,
    name: card.name || '',
    img: card.img || '',
    desc: join('<br><br>', split('\n', escapeHtml(card.desc))),
    prompts: join('', map(s => `<li>${escapeHtml(s)}</li>`, card.prompts || [])),
    rule: card.rule || '',
  })
}

async function outputCards(sourcedir, destfile) {
  const allCards = getCardData(sourcedir);
  let printedCards = [];
  allCards.forEach(card => {
    printedCards.unshift(cardToColumn(card.back, "B"));
    printedCards.push(cardToColumn(card.front, "A"));
  });
  const csvWriter = createWriter(destfile);
  await csvWriter.writeRecords(printedCards);
}

outputCards('card-data', 'cards.csv').catch(console.error)
