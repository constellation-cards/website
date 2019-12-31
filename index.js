const fs = require('fs')
      path = require('path'),
      escapeHtml = require('escape-html'),
      yaml = require('js-yaml');

const { concat, join, map, partition, reduce, split } = require('ramda');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'cards.csv',
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

function getCardFiles(dir) {
  const result = map(f => path.join(dir, f), fs.readdirSync(dir));
  let [dirs, files] = partition(path => fs.statSync(path).isDirectory(), result);
  files = reduce((efiles, dir) => concat(efiles, getCardFiles(dir)), files, dirs)
  return files;
}

const cards = [];

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

function parseCardContents(fileContent) {
  const content = yaml.safeLoad(fileContent);
  content.forEach(card => {
    cards.unshift(cardToColumn(card.back, "B"));
    cards.push(cardToColumn(card.front, "T"));  
  })
};

async function parseAllCards() {
  const filepaths = getCardFiles('src');
  for (let filepath of filepaths) {
    const fileContent = fs.readFileSync(filepath, 'utf8').toString();
    parseCardContents(fileContent);    
  }
  await csvWriter.writeRecords(cards);
}

parseAllCards().catch(console.error)