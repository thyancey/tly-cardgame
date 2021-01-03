import ThisModule from './deckmaker';
import Stack from './stack';

const SUIT_MAP = {
  'H': [
    [ 'suit', 'hearts' ],
    [ 'color', 'red' ]
  ],
  'D': [
    [ 'suit', 'diamonds' ],
    [ 'color', 'red' ]
  ],
  'C': [
    [ 'suit', 'clubs' ],
    [ 'color', 'black' ]
  ],
  'S': [
     ['suit', 'spades' ],
     ['color', 'black' ]
  ]
};

const VALUE_MAP = {
  '2': [ 
    [ 'value', 2, ],
    [ 'label', '2' ]
  ],
  '3': [
    [ 'value', 3, ],
    [ 'label', '3' ]
  ],
  '4': [ 
    [ 'value', 4, ],
    [ 'label', '4' ]
  ],
  '5': [ 
    [ 'value', 5, ],
    [ 'label', '5' ]
  ],
  '6': [ 
    [ 'value', 6, ],
    [ 'label', '6' ]
  ],
  '7': [ 
    [ 'value', 7, ],
    [ 'label', '7' ]
  ],
  '8': [ 
    [ 'value', 8, ],
    [ 'label', '8' ]
  ],
  '9': [ 
    [ 'value', 9, ],
    [ 'label', '9' ]
  ],
  '10': [ 
    [ 'value', 10, ],
    [ 'label', '10' ]
  ],
  'J': [ 
    [ 'value', 11, ],
    [ 'label', 'jack' ]
  ],
  'Q': [ 
    [ 'value', 12, ],
    [ 'label', 'queen' ]
  ],
  'K': [ 
    [ 'value', 13, ],
    [ 'label', 'king' ]
  ],
  'A': [ 
    [ 'value', 14, ],
    [ 'label', 'ace' ]
  ],
};

const SCORE_MAP = {
  'label': 1000,
  'color': 50,
  'suit': 200,
  'value': 800
};

const generateTraditionalDeckMeta = (value, suit) => {
  let allMeta = (SUIT_MAP[suit] || []).concat(VALUE_MAP[value] || []);
  return allMeta.map(m => ({
    tag: m[0],
    value: m[1],
    type: typeof m[1],
    score: SCORE_MAP[m[0]] || 0
  }));
};

const createTraditionalDeck = () => {
  const prefixes = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
  const suits = [ 'H', 'D', 'C', 'S' ];

  let deckIdx = 0;

  return suits.map(s => (
    prefixes.map(p => (
      {
        title: `sample_${p}${s}`,
        imageUrl: `./assets/cards/sample/${p}${s}.jpg`,
        meta: generateTraditionalDeckMeta(p, s),
        deckIdx: deckIdx++
      }
    ))
  )).flat()
};

/* too lazy to make the cards stack in a pile right now */
let shifter = 0;
const getInitialPlacement = () => {
  shifter += 2;
  return {
    x: 250 + shifter,
    y: 100 + shifter
  }
}

const getRandomPositionOnStage = () => {
  const wClamp = 200;
  const hClamp = 150;

  const w = window.innerWidth - (wClamp * 2);
  const h = window.innerHeight - (hClamp * 2);

  return {
    x: wClamp + Math.floor(Math.random() * w),
    y: hClamp + Math.floor(Math.random() * h),
  }
}

/* some mutation going on here needs to get fixed */
/* supports producing multiple cards outside of state, kinda sloppy */
const produceCard = (cardIdx, deck, hand, workOrder, topLayer) => {
  let filteredDeck = deck.filter((dC,idx) => {
    const inHand = hand.find(hC => hC.deckIdx === dC.deckIdx) || workOrder.indexOf(dC.deckIdx) > -1;
    return !inHand;
  });
  if(!filteredDeck || filteredDeck.length === 0){
    return null;
  }

  let randIdx = Math.floor(Math.random() * filteredDeck.length);
  let deckCard = filteredDeck[randIdx];
  let newPos = getInitialPlacement();

  return {
    cardIdx: cardIdx,
    deckIdx: deckCard.deckIdx,
    info: deckCard,
    status: null,
    layer: topLayer,
    position: newPos
  }
};

const getCardAtIdx = (cardData, cardIdx) => {
  const card = cardData[cardIdx];
  if(!card) return null;

  return card;
};

export default {
  createTraditionalDeck: createTraditionalDeck,
  produceCard: produceCard,
  getCardAtIdx: getCardAtIdx
};
