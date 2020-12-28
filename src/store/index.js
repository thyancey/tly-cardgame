import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import data from './data.json';

let topLayer = 0;

const getCardAtIdx = (cardData, cardIdx) => {
  const card = cardData[cardIdx];
  if(!card) return null;

  return card;
}

const createTraditionalDeck = () => {
  const prefixes = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
  const suits = [ 'H', 'D', 'C', 'S' ];

  return suits.map(s => (
    prefixes.map(p => (
      {
        title: `sample_${p}${s}`,
        imageUrl: `./assets/cards/${p}${s}.jpg`
      }
    ))
  )).flat()
}


const produceCard = (cardIdx, deck) => {
  let randIdx = Math.floor(Math.random() * deck.length);
  let randX = Math.random() * 500;
  let randY = Math.random() * 500;

  return {
    cardIdx: cardIdx,
    deckIdx: randIdx,
    info: deck[randIdx],
    status: null,
    layer: topLayer++,
    position: {
      x: randX,
      y: randY
    }
  }
}

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ hand, setHand ] = useState([]);
  // const [ deck, setDeck ] = useState(data.cards);
  const [ deck, setDeck ] = useState(createTraditionalDeck());
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);

  const discardCard = useCallback(cardIdx => {
    setHand(hand.filter(h => h.cardIdx !== cardIdx));
  }, [ setHand, hand ]);

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
    }));

  }, [ hand, setHand, holdingIdx, setHoldingIdx, discardCard, zones ]);

  const dropCard = useCallback(cardIdx => {
    if(cardIdx === holdingIdx){
      setHoldingIdx(-1);
    }
  }, [ holdingIdx, setHoldingIdx ]);

  const dealHand = useCallback(cardCount => {
    let newHand = [];
    topLayer = 1;

    for(let i = 0; i < cardCount; i++){
      newHand.push(
        produceCard(i, deck)
      );
    }
  
    setHand(newHand);
  }, [ setHand, deck ]);

  const dealCard = useCallback(cardCount => {
    let newHand = [];
    let startIdx = hand.length;
    
    for(let i = 0; i < cardCount; i++){
      newHand.push(
        produceCard((i + startIdx), deck)
      );
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
        hand: hand,
        deck: deck,
        zones: zones,
        stacks: stacks,
        setZone: setZone,
        setHoldingIdx: setHoldingIdx,
        dropCard: dropCard,
        firstCard: () => getCardAtIdx(deck, 0),
        setHand: setHand,
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
