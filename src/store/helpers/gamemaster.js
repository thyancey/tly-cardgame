import ThisModule from './gamemaster';
import DeckMaker from './deckmaker';

const store = {
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
    imageUrl: DeckMaker.getCompleteCardUrl(c, `./packs/${cardPackName}`),
    meta: DeckMaker.parseMeta(c.meta, scoreMap),
    deckIdx: deckIdx++
  })).flat();
}


const getRound = (roundIdx) => {
  try{
    // console.log('getting round', roundIdx, store.rounds)
    return store.rounds[roundIdx];
  }catch(e){
    console.error('could not retrieve current round');
  }
  
}

const getNumRounds = () => {
  return store.rounds.length;
}

const getAdjacentRoundIdx = (curIdx, change) => {
  const nextIdx = curIdx + change;
  if(nextIdx < 0){
    console.log('round is below 0!');
    return -1;
  }

  if(store.rounds.length > nextIdx){
    return nextIdx;
  }else{
    console.log('no more rounds!');
    return -1;
  }
}

const getRoundData = (roundIdx) => {
  console.log('getRoundData', roundIdx, store.rounds)
  try{
    return {
      idx: roundIdx,
      targetScore: store.rounds[roundIdx].targetScore,
      title: store.rounds[roundIdx].title,
    }
  }catch(e){
    return {
      idx: -1,
      targetScore: 2000
    }
  }
}
const getCardPack = () => {
  return store.cardPack;
}

const getRoundDeck = (roundIdx) => {
  console.log('getRoundDeck');
  if(isNaN(roundIdx)){
    console.error('getRoundDeck missing valid roundIdx', roundIdx);
    return [];
  }
  const rD = ThisModule.getRound(roundIdx);
  if(rD.deck){
    let roundCardIds = ThisModule.getRound(roundIdx).deck;
    return ThisModule.getCardPack().filter(c => roundCardIds.indexOf(c.id) > -1);
  }else{
    //- if no custom deck defined, give the whole thing
    return ThisModule.getCardPack();
  }
}

const getStore = () => store;

export default {
  setRoundData: setRoundData,
  setCardPackData: setCardPackData,
  getAdjacentRoundIdx: getAdjacentRoundIdx,
  getRound: getRound,
  getRoundDeck: getRoundDeck,
  getRoundData: getRoundData,
  getStore: getStore,
  getCardPack: getCardPack,
  getNumRounds: getNumRounds
};
