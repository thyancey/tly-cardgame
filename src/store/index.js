import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import data from './data.json';
import StackHelper from './helpers/stack';
import DeckMaker from './helpers/deckmaker';

let topLayer = 0;

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ focusedStackIdx, setFocusedStackIdx ] = useState(-1);
  const [ hand, setHandRaw ] = useState([]);
  // const [ deck, setDeck ] = useState(data.cards);
  const [ deck, setDeck ] = useState(DeckMaker.createTraditionalDeck());
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);

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
    let newHand = [];
    topLayer = 1;

    for(let i = 0; i < cardCount; i++){
      let newCard = DeckMaker.produceCard(i, deck, [], [], topLayer++);
      newCard && newHand.push(newCard);
    }
  
    setHand(newHand);
  }, [ setHand, deck ]);

  /* dealing more than 1 is not working as expected */
  const dealCard = useCallback(cardCount => {
    let newHand = [];
    let startIdx = hand.length;
    
    let workOrder = [];
    for(let i = 0; i < cardCount; i++){
      let newCard = DeckMaker.produceCard((i + startIdx), deck, hand, workOrder, topLayer++);
      if(newCard){
        workOrder.push(newCard.deckIdx);
      }
      newCard && newHand.push(newCard);
    }

    setHand(hand.concat(newHand));
  }, [ setHand, deck, hand ]);

  
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
            bounds: bounds
          }
        }else{
          return z;
        }
      }));
    }else{
      setZones(zones.concat([
        {
          id:zoneId,
          bounds: bounds
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
        setZone: setZone,
        setHoldingIdx: setHoldingIdx,
        setFocusedStackIdx: setFocusedStackIdx,
        firstCard: () => DeckMaker.getCardAtIdx(deck, 0),
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
