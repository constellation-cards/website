const fs = require('fs')
  path = require('path'),
  yaml = require('js-yaml');

const { concat, filter, has, map, partition, reduce, unnest } = require('ramda');

const tagIconMapping = {
  "front": "arrow-up-circle.png",
  "back": "arrow-down-circle.png",
  "character": "star.png",
  "upbringing": "home.png",
  "focus": "key.png",
  "role": "user.png",
  "condition": "heart.png",
  "encounter": "alert-circle.png",
  "modifier": "plus-circle.png",
  "oracle": "help-circle.png",
  "success": "shuffle.png",
  // "demo": "",
}

const tagStackMapping = {
  "upbringing": "Character (Upbringing)",
  "focus": "Character (Focus)",
  "role": "Character (Role)",
  "condition": "Condition",
  "encounter": "Encounter",
  "success": "Success Oracle",
  "emotion": "Emotion Oracle",
}

function iconForTag(tag) {
  return tagIconMapping[tag]
}

function stackForCard(face) {
  return reduce(
    (ft, tag) => tagStackMapping[tag] || ft,
    "Custom",
    face.tags
  )
}

/**
 * Look for YAML files holding card data under a given directory.
 * Return a list of full paths to those files.
 * @param {*} dir 
 */
function getCardPaths(dir) {
  const result = map(f => path.join(dir, f), fs.readdirSync(dir));
  let [dirs, files] = partition(path => fs.statSync(path).isDirectory(), result);
  files = reduce((efiles, dir) => concat(efiles, getCardFiles(dir)), files, dirs)
  return files;
}

/**
 * Look for card data under a given directory.
 * Return an array of cards
 * @param {*} dir 
 */
function getCardData(dir) {
  const filepaths = getCardPaths(dir);
  const filecontent = map(filepath => fs.readFileSync(filepath, 'utf8').toString(), filepaths);
  const rows = unnest(map(content => yaml.safeLoad(content), filecontent));
  const carddata = filter(has('front'), rows);
  return carddata;
}

module.exports = {
  getCardData,
  iconForTag,
  stackForCard
}