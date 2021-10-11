import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import StackHelper from './helpers/stack';
import DeckMaker from './helpers/deckmaker';
import GameMaster from './helpers/gamemaster';
import DataHelper from './helpers/data';

let topLayer = 0;

// const DEFAULT_DECK = 'sample';
const DEFAULT_DECK = 'traditional';

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ focusedStackIdx, setFocusedStackIdx ] = useState(-1);
  const [ hand, setHandRaw ] = useState([]);
  const [ handHolding, setHandHolding ] = useState([]);
  const [ deck, setDeck ] = useState([]);
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);
  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [ roundData, setRoundData ] = useState({});

  const setAllRoundData =  useCallback(newRoundIdx => {
    setRoundData(GameMaster.getRoundData(newRoundIdx));
  }, [ setRoundData ]);

  const loadData = useCallback(deckName => {
    deckName = deckName || DEFAULT_DECK;


    const dataUrl = `./decks/${deckName}/data.json`;
    // console.log('loading data from ', dataUrl);
    DataHelper.loadData(dataUrl, (data) => {
      try{
        console.log('heres your data', data);
        GameMaster.setRoundData(data.deck.rounds);
        GameMaster.setCardPackData(data.deck.cards, data.deck.scoreMap, data.deck.name);

        const roundIdx = 0;
        setAllRoundData(roundIdx);
        setDeck(GameMaster.getRoundDeck(roundIdx));
        setDataLoaded(true);
      }
      catch(e){
        console.error('problem intializing data', e)
      }
    });
  }, [ setDataLoaded, setAllRoundData ]);

  const setHand = useCallback((hand, responsibleIdx) => {
    // console.log('setHand', responsibleIdx);
    const stacks = StackHelper.calcStacks(hand);
    setStacks(stacks);
    // console.log('setStacks', stacks)
    
    const newHand = hand.map(c => ({
      ...c,
      stackIdx: stacks.findIndex(s => s.indexOf(c.cardIdx) > -1)
    }));

    setHandRaw(newHand);
    if(responsibleIdx > -1){
      setFocusedStackIdx(newHand.find(c => c.cardIdx === responsibleIdx).stackIdx);
    }
  }, [ setHandRaw, setStacks, setFocusedStackIdx ]);

  const discardCard = useCallback(cardIdx => {
    setHand(hand.filter(h => h.cardIdx !== cardIdx));
  }, [ setHand, hand ]);

  /* dragging a card around.. */
  const setCardPosition = useCallback((cardIdx, newPosition, didDrop) => {
    if(cardIdx === holdingIdx){
      setHoldingIdx(-1);
    }

    const foundCard = hand.find(c => c.cardIdx === cardIdx);
    if(foundCard && didDrop){
      let activeZones = null;
      if(foundCard){
        activeZones = getZonesAtPosition(newPosition, zones);
      }

      if(activeZones.find(az => az.id === 'discard')){
        discardCard(cardIdx);
        return;
      }
    }

    setHand(hand.map(c => {
      if(c.cardIdx === cardIdx){
        
        return {
          ...c,
          layer: topLayer++,
          position:{
            x: newPosition.x,
            y: newPosition.y
          }
        }
      }
  
      return c;
    }), foundCard.cardIdx);
    

  }, [ hand, setHand, holdingIdx, setHoldingIdx, discardCard, zones ]);

  const removeCardInHand = useCallback((cardIdx, state) => {
    return setHand(hand.map(h => {
      if(h.cardIdx === cardIdx){
        return {
          ...h,
          inHand:false
        }
      }else{
        return h;
      }
    }));
  }, [ hand, setHand ]);

  const dealHand = useCallback(cardLimit => {
    topLayer = 1;
    const newHand = DeckMaker.produceHand(deck.length - (cardLimit || 0), GameMaster.getRoundDeck(roundData.idx), [], topLayer);

    topLayer += newHand.length;
    setHand(newHand);
  }, [ setHand, roundData.idx, deck ]);

  const dealCard = useCallback(cardCount => {
    const newHand = DeckMaker.produceHand(cardCount, GameMaster.getRoundDeck(roundData.idx), hand, topLayer);

    topLayer += newHand.length;
    setHand(hand.concat(newHand));
  }, [ setHand, hand, roundData.idx ]);

  const discardHand = useCallback(() => {
    topLayer = 1;
    setHand([]);
  }, [ setHand ]);

  const discardRandomCard = useCallback(() => {
    if(hand.length > 0){
      const randHandIdx = Math.floor(Math.random() * hand.length);
      discardCard(hand[randHandIdx].cardIdx);
    }
  }, [ discardCard, hand ]);
  
  /* this zone junk needs some work */
  const setZone = useCallback((zoneId, bounds) => {
    if(zones.find(z => z.id === zoneId)){
      setZones(zones.map(z => {
        if(z.id === zoneId){
          return {
            ...z,
            bounds: {
              top: bounds.top,
              left: bounds.left,
              right: bounds.right,
              bottom: bounds.bottom
            }
          }
        }else{
          return z;
        }
      }));
    }else{
      setZones(zones.concat([
        {
          id:zoneId,
          bounds: {
            top: bounds.top,
            left: bounds.left,
            right: bounds.right,
            bottom: bounds.bottom
          }
        }
      ]))
    }
  }, [ zones, setZones ]);

  const getZonesAtPosition = (position, zones) => {
    return zones.filter(z => {
      return (
        (position.x > z.bounds.left && position.x < z.bounds.right)
        && (position.y > z.bounds.top && position.y < z.bounds.bottom)
      );
    })
  }

  const nextRound = useCallback(() => {
    const foundIdx = GameMaster.getAdjacentRoundIdx(roundData.idx, 1);
    if(foundIdx > -1){
      discardHand();
      setAllRoundData(foundIdx);
      setDeck(GameMaster.getRoundDeck(foundIdx));
    }else{
      console.log('nextRound, end of rounds!');
    }
  }, [ roundData.idx, setAllRoundData, discardHand ]);
  
  const prevRound = useCallback(() => {
    const foundIdx = GameMaster.getAdjacentRoundIdx(roundData.idx, -1);
    if(foundIdx > -1){
      discardHand();
      setAllRoundData(foundIdx);
      setDeck(GameMaster.getRoundDeck(foundIdx))
    }else{
      console.log('nextRound, end of rounds!');
    }
  }, [ roundData.idx, setAllRoundData, discardHand ]);

  const setRound = useCallback(roundIdx => {
    const foundRound = GameMaster.getRound(roundIdx);
    if(foundRound){
      discardHand();
      setAllRoundData(roundIdx);
      setDeck(GameMaster.getRoundDeck(roundIdx))
    }else{
      console.log(`setRound, roundIdx "${roundIdx}" not found`);
    }
  }, [ setAllRoundData, discardHand ])

  return (
    <StoreContext.Provider 
      value={{
        holdingIdx: holdingIdx,
        focusedStackIdx: focusedStackIdx,
        hand: hand,
        handHolding: handHolding,
        deck: deck,
        zones: zones,
        stacks: stacks,
        dataLoaded: dataLoaded,
        roundData: roundData,
        setZone: setZone,
        nextRound: nextRound,
        prevRound: prevRound,
        setRound: setRound,
        loadData: loadData,
        setHoldingIdx: setHoldingIdx,
        setFocusedStackIdx: setFocusedStackIdx,
        firstCard: () => DeckMaker.getCardAtIdx(GameMaster.getRoundDeck(roundData.idx), 0),
        setCardPosition: setCardPosition,
        // addCardInHand: addCardInHand,
        removeCardInHand: removeCardInHand,
        dealHand: dealHand,
        dealCard: dealCard,
        discardCard: discardCard,
        discardRandomCard: discardRandomCard,
        discardHand: discardHand
      }}>
        {children}
    </StoreContext.Provider>
  );
}

export default Store;
