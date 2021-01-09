import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import StackHelper from './helpers/stack';
import DeckMaker from './helpers/deckmaker';
import GameMaster from './helpers/gamemaster';
import DataHelper from './helpers/data';

let topLayer = 0;

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ focusedStackIdx, setFocusedStackIdx ] = useState(-1);
  const [ hand, setHandRaw ] = useState([]);
  // const [ deck, setDeck ] = useState([]);
  const [ deck, setDeck ] = useState(DeckMaker.createTraditionalDeck());
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);
  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [ level, setLevel ] = useState({
    targetScore: 0
  });

  const loadData = useCallback(deckName => {
    deckName = deckName || 'sample';

    if(deckName === 'traditional'){
      setDeck(DeckMaker.createTraditionalDeck());
      setDataLoaded(true);
    }else{
      const dataUrl = `./decks/${deckName}/data.json`;
      // console.log('loading data from ', dataUrl);
      DataHelper.loadData(dataUrl, (data) => {
        // console.log('heres your data', data);
        // setDeck(DeckMaker.createDeckFromData(deckName, data.deck.cards, data.deck.scoreMap));
        GameMaster.setRoundData(data.deck.levels);
        GameMaster.setCardPackData(data.deck.cards, data.deck.scoreMap, data.deck.name);
        GameMaster.setRound(0);
        setDeck(GameMaster.getCardPack());

        setLevel(GameMaster.getRoundData(0));
        // setLevel(DeckMaker.getLevelData(data.deck));
        setDataLoaded(true);


        setDataLoaded(true);
      });
    }
  }, [ setDataLoaded ]);

  const setHand = useCallback((hand, responsibleIdx) => {
    const stacks = StackHelper.calcStacks(hand);
    setStacks(stacks);
    
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

  const dealHand = useCallback(cardCount => {
    topLayer = 1;
    
    const newHand = DeckMaker.produceHand(cardCount, GameMaster.getRoundDeck(), [], topLayer);

    topLayer += newHand.length;
    setHand(newHand);
  }, [ setHand ]);

  const dealCard = useCallback(cardCount => {
    const newHand = DeckMaker.produceHand(cardCount, GameMaster.getRoundDeck(), hand, topLayer);

    topLayer += newHand.length;
    setHand(hand.concat(newHand));
  }, [ setHand, hand ]);

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

  return (
    <StoreContext.Provider 
      value={{
        holdingIdx: holdingIdx,
        focusedStackIdx: focusedStackIdx,
        hand: hand,
        deck: deck,
        zones: zones,
        stacks: stacks,
        dataLoaded: dataLoaded,
        level: level,
        setLevel: setLevel,
        setZone: setZone,
        loadData: loadData,
        setHoldingIdx: setHoldingIdx,
        setFocusedStackIdx: setFocusedStackIdx,
        firstCard: () => DeckMaker.getCardAtIdx(GameMaster.getRoundDeck(), 0),
        setCardPosition: setCardPosition,
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
