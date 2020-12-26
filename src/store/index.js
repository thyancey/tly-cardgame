import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import data from './data.json';

function getCardAtIdx(cardData, cardIdx){
  const card = cardData[cardIdx];
  if(!card) return null;

  return card;
}

function dealHand(cardCount, deck){
  let ret = [];
  for(let i = 0; i < cardCount; i++){
    let randIdx = Math.floor(Math.random() * deck.length);
    let randX = Math.random() * 500;
    let randY = Math.random() * 500;
    ret.push({ 
      cardIdx: i,
      deckIdx: randIdx, 
      info: deck[randIdx],
      status:null, 
      manualPlacement: true, 
      position: {
        x: randX,
        y: randY 
      },
      defaultPosition: {
        x: randX,
        y: randY
      }
    });
  }

  return ret;
}

function createTraditionalDeck(){
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

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ hand, setHand ] = useState([]);
  // const [ deck, setDeck ] = useState(data.cards);
  const [ deck, setDeck ] = useState(createTraditionalDeck());

  const prepNewCardPosition = useCallback((cardIdx, newPosition) => {
    setHand(hand.map(h => {
      if(h.cardIdx === cardIdx){
        return {
          ...h,
          position:{
            x: newPosition.x,
            y: newPosition.y
          }
        }
      }
  
      return h;
    }));
  }, [ hand, setHand ]);

  const dealHand = useCallback(cardCount => {
    let newHand = [];
    for(let i = 0; i < cardCount; i++){
      let randIdx = Math.floor(Math.random() * deck.length);
      let randX = Math.random() * 500;
      let randY = Math.random() * 500;
      newHand.push({ 
        cardIdx: i,
        deckIdx: randIdx, 
        info: deck[randIdx],
        status:null, 
        manualPlacement: true, 
        position: {
          x: randX,
          y: randY 
        },
        defaultPosition: {
          x: randX,
          y: randY
        }
      });
    }
  
    setHand(newHand);
  }, [ setHand, deck ]);

  return (
    <StoreContext.Provider 
      value={{
        holdingIdx: holdingIdx,
        setHoldingIdx: setHoldingIdx,
        firstCard: () => getCardAtIdx(deck, 0),
        hand: hand,
        deck: deck,
        setHand: setHand,
        setCardPosition: (cardIdx, newPosition) => prepNewCardPosition(cardIdx, newPosition),
        // dealHand: (cardCount) => setHand(dealHand(cardCount, deck))
        dealHand: dealHand
      }}>
        {children}
    </StoreContext.Provider>
  );
}

export default Store;
