(function() {
  "use strict"

  var flipACard = flipACard || {}

  flipACard.cardData = null;

  flipACard.decodeEditorText = function(t) {
    return t.substring(t.indexOf('['), t.lastIndexOf(']') + 1)
  };

  /**
   * Utility code for parsing command line arguments.
   * Adapted from https://stackoverflow.com/a/18647776
   */

  flipACard.commandParserRegex = /[^\s"]+|"([^"]*)"/gi;

  /**
   * Usage: parseCommand('This is a \"quoted string\"');
   * 
   * @param string a command to be parsed
   * @returns an array of words
   */
  flipACard.parseCommand = function(input) {
      let output = [];
      let match;
      do {
          match = flipACard.commandParserRegex.exec(input);
          if (match != null) {
              output.push(match[1] || match[0]);
          }
      } while(match != null);
      return output;
  }

  /**
   * A simple function for sending a message to chat.
   * 
   * @param msg A string message to send to all users
   */
  flipACard.reply = function(msg) {
    sendChat("", msg)
    return null
  }

  /**
   * A utility function for generating UUIDs,
   * used in repeating row IDs.
   * 
   * @returns string
   */
  flipACard.generateUUID = function() {
    "use strict"

    var a = 0,
      b = []
    return (function() {
      var c = new Date().getTime() + 0,
        d = c === a
      a = c
      for (var e = new Array(8), f = 7; 0 <= f; f--) {
        e[
          f
        ] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
          c % 64
        )
        c = Math.floor(c / 64)
      }
      c = e.join("")
      if (d) {
        for (f = 11; 0 <= f && 63 === b[f]; f--) {
          b[f] = 0
        }
        b[f]++
      } else {
        for (f = 0; 12 > f; f++) {
          b[f] = Math.floor(64 * Math.random())
        }
      }
      for (f = 0; 12 > f; f++) {
        c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
          b[f]
        )
      }
      return c
    })()
  }

  /**
   * Generate a Roll20 row ID for repeating elements.
   * 
   * @returns string
   */
  flipACard.generateRowID = function() {
    return flipACard.generateUUID().replace(/_/g, "Z")
  }

  /**
   * Look up a character by name,
   * and return the Roll20 Character object.
   * Currently this lookup must match exactly,
   * but is case insensitive.
   * 
   * @param characterName the character to find
   */
  flipACard.findCharacter = function(characterName) {
    var candidates = findObjs(
      {
        _type: "character",
        name: characterName,
      },
      { caseInsensitive: true }
    )
    if (candidates.length === 0) {
      return flipACard.reply(`No character named '${characterName}' was found`)
    } else if (candidates.length > 1) {
      return flipACard.reply(
        `Multiple characters named '${characterName}' were found`
      )
    } else {
      return candidates[0]
    }
  }

  /**
   * Looks for a handout called "cards.json".
   * Parses the contents of the handout as JSON data,
   * caches it as "cardData", and returns it.
   */
  flipACard.getCardsJson = function(callback) {
    if(flipACard.cardData != null) {
      return callback(flipACard.cardData);
    }
    var candidates = findObjs(
      {
        _type: "handout",
        name: "cards.json",
      },
      { caseInsensitive: true }
    )
    if(!candidates || candidates.length !== 1) {
      flipACard.reply("No handout found named cards.json, or multiple handouts found");
    } else {
      candidates[0].get("gmnotes", function(note) {
        const noteText = flipACard.decodeEditorText(note);
        try {
          flipACard.cardData = JSON.parse(noteText);
          return callback(flipACard.cardData);
        } catch(e) {
          flipACard.reply(`Error parsing JSON: ${e.message}`);
        }  
      })
    }
  }

  /**
   * Add a named attribute to a character object.
   * 
   * @param character the Roll20 character object
   * @param prefix a prefix for the attribute name, e.g. "repeating_cards_(rowID)"
   * @param name the suffix for the attribute name, e.g. "front_name"
   * @param value the value for the attribute, e.g. "Courage"
   */
  flipACard.addAttribute = function(character, prefix, name, value) {
    createObj("attribute", {
      name: `${prefix}_${name}`,
      current: value,
      max: value,
      characterid: character.id,
    })
  }

  /**
   * Given a Roll20 character object and a JSON card,
   * add the card as a character attribute.
   */
  flipACard.addCardAsRow = function(character, card) {
    const prefix = `repeating_cards_${flipACard.generateRowID()}`
    flipACard.addAttribute(character, prefix, "card_flipped", "0")
    flipACard.addAttribute(character, prefix, "card_edit", "on")
    flipACard.addAttribute(character, prefix, "front_name", card.front.name)
    flipACard.addAttribute(character, prefix, "front_desc", card.front.desc)
    flipACard.addAttribute(character, prefix, "back_name", card.back.name)
    flipACard.addAttribute(character, prefix, "back_desc", card.back.desc)
  }

  flipACard.addCardFromJson = function(recipient, cardData) {
    const candidate = flipACard.findCharacter(recipient)
    if (!candidate) {
      return
    }
    const defaultValues = { name: "No Name", desc: "No description" }
    const card = {
      front: _.defaults(cardData.front || {}, defaultValues),
      back: _.defaults(cardData.back || {}, defaultValues),
    }
    const cardName =
      card.front.name == card.back.name
        ? card.front.name
        : `${card.front.name} / ${card.back.name}`
    flipACard.addCardAsRow(candidate, card)
    flipACard.reply(`Adding ${cardName} to ${candidate.get("name")}`)
  }

  flipACard.addCardFromRaw = function(recipient, jsonBlob) {
    try {
      const cardData = JSON.parse(jsonBlob)
      return flipACard.addCardFromJson(recipient, cardData)
    } catch (e) {
      flipACard.reply(`Error parsing JSON: ${e.message}`)
    }
  }

  // Equals ignore case
  flipACard.eqic = function(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;
  }

  flipACard.addCardByName = function(recipient, cardName) {
    const cnlc = cardName.toLowerCase();
    flipACard.getCardsJson(function(cardData) {
      const matchingCard = _.find(cardData, function(card){
        return flipACard.eqic(cardName, card.front.name) || flipACard.eqic(cardName, card.back.name);
      });
      if (matchingCard) {
        return flipACard.addCardFromJson(recipient, matchingCard);
      } else {
        flipACard.reply(`No card named '${cardName}'`);
      }
    })
  }

  flipACard.addCardsByTag = function(recipient, tagname, limit) {
    flipACard.getCardsJson(function(cardData) {
      const matchingCards = _.filter(cardData, function(card){
        return _.contains(card.front.tags, tagname) || _.contains(card.back.tags, tagname);
      });
      if (matchingCards) {
        for(let card of _.sample(matchingCards, _.min([limit, matchingCards.length]))) {
          flipACard.addCardFromJson(recipient, card);
        }
      } else {
        flipACard.reply(`No cards tagged '${cardName}'`);
      }
    })

  }

  flipACard.parseChatMessage = function(msg) {
    if (msg.type === 'api') {
      const output = flipACard.parseCommand(msg.content);
      switch (output[0]) {
        case '!deal':
          flipACard.addCardByName(output[1], output[2]);
          break;
        case '!dealone':
          flipACard.addCardsByTag(output[1], output[2], 1);
          break;
        case '!dealall':
          flipACard.addCardsByTag(output[1], output[2], 9999);
          break;  
        case '!clearcardcache':
          flipACard.cardData = null;
          flipACard.reply("Card cache cleared");
          break;
        case '!help':
          flipACard.reply('Usage: !deal <player name> <card name>');
          flipACard.reply('Usage: !dealone <player name> <card tag>');
          flipACard.reply('Usage: !dealall <player name> <card tag>');
          flipACard.reply('Player, card, and tag names must be exact, but are not case sensitive');
        default:
          break;
      }
    }
  }

  on("ready", function() {
    on("chat:message", flipACard.parseChatMessage)
  })
})()
