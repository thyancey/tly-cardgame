import ThisModule from './gamemaster';
import DeckMaker from './deckmaker';

const store = {
  'roundIdx': -1,
  'rounds': [],
  'cardPack': [],
  'scoreMap': [],
  'name': null
};

const setRoundData = (roundData, roundIdx) => {
  store.rounds = roundData;
}

const setCardPackData = (cardPackData, scoreMap, cardPackName) => {
  store.scoreMap = scoreMap;
  store.name = cardPackName;

  let deckIdx = 0;
  store.cardPack = cardPackData.map(c => ({
    id: c.id,
    title: c.title || 'no title',
    imageUrl: DeckMaker.getCompleteCardUrl(c, `./decks/${cardPackName}`),
    meta: DeckMaker.parseMeta(c.meta, scoreMap),
    deckIdx: deckIdx++
  })).flat();
}

const setRound = roundIdx => {
  if(store.rounds[roundIdx]){
    store.roundIdx = roundIdx;
  }else{
    console.error('trying to set invalid roundIdx', roundIdx);
  }
}

const nextRound = () => {
  if(store.rounds.length - 1 > store.roundIdx){
    ThisModule.setRound(store.roundIdx + 1);
  }else{
    console.log('no more rounds!');
  }
}

const getRound = () => {
  try{
    return store.rounds[store.roundIdx];
  }catch(e){
    console.error('could not retrieve current round');
  }
  
}

const getRoundData = (roundIdx) => {
  try{
    if(roundIdx === undefined){
      roundIdx = store.roundIdx;
    }

    return {
      targetScore: store.rounds[roundIdx].targetScore
    }
  }catch(e){
    return {
      targetScore: 2000
    }
  }
}
const getCardPack = () => {
  return store.cardPack;
}

const getRoundDeck = () => {
  let roundCardIds = ThisModule.getRound().deck;
  return ThisModule.getCardPack().filter(c => roundCardIds.indexOf(c.id) > -1);
}

const getStore = () => store;

export default {
  setRoundData: setRoundData,
  setCardPackData: setCardPackData,
  setRound: setRound,
  nextRound: nextRound,
  getRound: getRound,
  getRoundDeck: getRoundDeck,
  getRoundData: getRoundData,
  getStore: getStore,
  getCardPack: getCardPack
};
