;(function() {
  "use strict";

  var flipACard = flipACard || {}

  flipACard.reply = function(msg) {
    sendChat("", msg);
    return null;
  }

  flipACard.generateUUID = function() {
    "use strict";

    var a = 0, b = [];
    return function() {
        var c = (new Date()).getTime() + 0, d = c === a;
        a = c;
        for (var e = new Array(8), f = 7; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++){
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    }();
  }

  flipACard.generateRowID = function () {
    return flipACard.generateUUID().replace(/_/g, "Z");
  };

  // Return one and only one character sheet, by name
  flipACard.findCharacter = function(characterName) {
    var candidates = findObjs({
      _type: 'character',
      name: characterName,
    }, {caseInsensitive: true});
    if(candidates.length === 0) {
      return flipACard.reply(`No character named '${characterName}' was found`);
    } else if(candidates.length > 1) {
      return flipACard.reply(`Multiple characters named '${characterName}' were found`);
    } else {
      return candidates[0];
    }
  }

  flipACard.addAttribute = function(character, prefix, name, value) {
    createObj("attribute", {
      name: `${prefix}_${name}`,
      current: value,
      max: value,
      characterid: character.id
  });
  }

  flipACard.addCardAsRow = function(character, card) {
    const prefix = `repeating_cards_${flipACard.generateRowID()}`;
    flipACard.addAttribute(character, prefix, "card_flipped", "0");
    flipACard.addAttribute(character, prefix, "card_edit", "on");
    flipACard.addAttribute(character, prefix, "front_name", card.front.name);
    flipACard.addAttribute(character, prefix, "front_desc", card.front.desc);
    flipACard.addAttribute(character, prefix, "back_name", card.back.name);
    flipACard.addAttribute(character, prefix, "back_desc", card.back.desc);
  }

  flipACard.addCard = function(recipient, jsonBlob) {
    const candidate = flipACard.findCharacter(recipient);
    if (!candidate) {
      return;
    }
    try {
      const cardData = JSON.parse(jsonBlob);
      const card = _.defaults(cardData, {front: {name: "No Name", desc: "No description"}, back: {name: "No Name", desc: "No description"}});
      const cardName = (card.front.name == card.back.name) ? card.front.name : `${card.front.name} / ${card.back.name}`;
      flipACard.addCardAsRow(candidate, card);
      flipACard.reply(`Adding ${cardName}/ to ${candidate.get('name')}`);
    } catch (e) {
      flipACard.reply(`Error parsing JSON: ${e.message}`);
    }
  }

  flipACard.parseChatMessage = function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!addcard") !== -1) {
      const matches = msg.content.match(/!addcard\s+(\w+)\s+(.*)$/i);
      if (matches) {
        flipACard.addCard(matches[1], matches[2]);
      } else {
        flipACard.reply('Syntax: !addcard <recipient> <json>')
      }
    }
  }

  on('ready', function() {
    on('chat:message', flipACard.parseChatMessage);
  });
})()
