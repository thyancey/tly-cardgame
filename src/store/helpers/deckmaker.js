import { CARDSTATUS } from '../../utils/constants';
import ThisModule from './deckmaker';

const parseMeta = (metaArray, scoreMap) => {
  if(!metaArray) return [];

  return metaArray.map(m => ({
    tag: m[0],
    value: m[1],
    type: typeof m[1],
    score: scoreMap[m[0]] || 0
  }));
}

const getCompleteCardUrl = (c, deckPath) => {
  if(c.assetPath){
    return `${deckPath}/assets/${c.assetPath}`;
  }else if(c.imageUrl){
    return c.imageUrl;
  }else{
    return './assets/cards/sample.jpg';
  }
}

const createDeckFromData = (deckName, deckList, scoreMap) => {
  let deckIdx = 0;
  return deckList.map(c => ({
    title: c.title || 'no title',
    imageUrl: ThisModule.getCompleteCardUrl(c, `./packs/${deckName}`),
    meta: ThisModule.parseMeta(c.meta, scoreMap),
    deckIdx: deckIdx++
  })).flat()
};

/* too lazy to make the cards stack in a pile right now */
let shifter = 0;
const getInitialPlacement = () => {
  shifter += 2;
  return {
    x: 250 + shifter,
    y: 200 + shifter
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

const filterDeckToWhatsLeft = (activeCards, deck, workOrder) => {
  if(!workOrder) workOrder = [];

  return deck.filter((dC,idx) => {
    const inPlay = activeCards.find(aC => aC.deckIdx === dC.deckIdx) || workOrder.indexOf(dC.deckIdx) > -1;
    return !inPlay;
  });
}

const getStartIdxForHand = hand => {
  try{
    if(!hand || hand.length === 0) return 0;
    return hand[hand.length - 1].cardIdx + 1;
  }catch(e){
    console.error('couldnt get start index with hand', hand)
    return 0;
  }
}

const produceDeckHand = (deck, hand, cardLayer) => {
  const newHand = [];
  const workOrder = [];
  let startIdx = 0;
  if(cardLayer === undefined){
    cardLayer = 1;
  }

  /* this is stupid and complicated */
  if(hand){
    startIdx = getStartIdxForHand(hand);
  }else{
    hand = [];
  }

  for(let i = 0; i < deck.length; i++){
    let newCard = ThisModule.produceCard((i + startIdx), deck, hand, workOrder, cardLayer++);
    if(newCard){
      workOrder.push(newCard.deckIdx);
    }
    newCard && newHand.push(newCard);
  }
  
  return newHand;
}

const produceHand = (cardCount, deck, hand, cardLayer) => {
  const newHand = [];
  const workOrder = [];
  let startIdx = 0;
  if(cardLayer === undefined){
    cardLayer = 1;
  }

  /* this is stupid and complicated */
  if(hand){
    startIdx = getStartIdxForHand(hand);
  }else{
    hand = [];
  }

  for(let i = 0; i < cardCount; i++){
    let newCard = ThisModule.produceCard((i + startIdx), deck, hand, workOrder, cardLayer++);
    if(newCard){
      workOrder.push(newCard.deckIdx);
    }
    newCard && newHand.push(newCard);
  }
  
  return newHand;
}

/* some mutation going on here needs to get fixed */
/* supports producing multiple cards outside of state, kinda sloppy */
const produceCard = (cardIdx, deck, hand, workOrder, topLayer) => {
  let filteredDeck = ThisModule.filterDeckToWhatsLeft(hand, deck, workOrder);
  if(!filteredDeck || filteredDeck.length === 0){
    console.warn('the deck is empty!')
    return null;
  }

  let randIdx = Math.floor(Math.random() * filteredDeck.length);
  let deckCard = filteredDeck[randIdx];
  let newPos = getInitialPlacement();

  return {
    cardIdx: cardIdx,
    deckIdx: deckCard.deckIdx,
    info: deckCard,
    status: CARDSTATUS.HAND,
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
  createDeckFromData: createDeckFromData,
  parseMeta: parseMeta,
  produceCard: produceCard,
  getCardAtIdx: getCardAtIdx,
  filterDeckToWhatsLeft: filterDeckToWhatsLeft,
  produceHand: produceHand,
  produceDeckHand: produceDeckHand,
  getCompleteCardUrl: getCompleteCardUrl
};
