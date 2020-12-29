import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import data from './data.json';

let topLayer = 0;

const O = {
  W: 50,
  H: 75
}

const isThisInThat = (aA, aB) => {
  if(!aA) console.error('aA invalid')
  if(!aB) console.error('aB invalid')
  let foundIdx = aA.findIndex(a => aB.indexOf(a) > -1);
  return foundIdx > -1;
}

const mergeArrays = (aA, aB) => {
  return aA.concat(aB.filter((b) => aA.indexOf(b) < 0));
}

/* this is too complicated, gotta be a better way
  input
    [ 0, 1, 2]
    [ 5, 6 ]
    [ 7, 8 ]
    [ 1, 5]

  output
    [ 0, 1, 2, 5, 6 ]
    [ 7, 8 ]
*/
const collapseGroups = groups => {
  // console.log('--------- collapsing groups:', groups)
  let collapsed = [];
  for(let g = groups.length - 1; g >= 0; g--){
    if(collapsed.length === 0){
      collapsed.push(groups[g]);
      groups.pop();
    }else{
      for(let c = 0; c < collapsed.length; c++){
        if(isThisInThat(collapsed[c], groups[g])){
          collapsed[c] = mergeArrays(collapsed[c], groups[g]);
          groups.pop();
          break;
        }else{
          collapsed.push(groups.pop());
          break;
        }
  
      }
    }
  }

  return collapsed;
}

  /* This works, but sure seems like it could be simplified!
    - compares bounds of all cards
    - returns list of "stacks" of unique cardIdxs that are touching
    - there is so much dirty mutation throughout here and probably some big inefficiencies
    ->  [ [ 0, 2, 5], [ 1, 3 ] ]
  */
 const calcStacks = (hand) => {
  let groupPairs = [];

  // cards only start with position
  const boundedHand = hand.map(c => ({
    cardIdx: c.cardIdx,
    bounds: produceBounds(c.position)
  }));

  // do some weird loopin to avoid checking the same pair twice
  for(let a = 0; a < boundedHand.length; a++){
    for(let b = a + 1; b < boundedHand.length; b++){
      if(doesOverlap(boundedHand[a].bounds, boundedHand[b].bounds)){
        groupPairs.push([boundedHand[a].cardIdx, boundedHand[b].cardIdx]);
      }
    }
  }

  /*
  //- now have a list of..
    [0, 1]
    [1, 2]
    [4, 5]

  // so convert to
    [0, 1, 2]
    [4, 5]
  */
  let finalGroups = [];
  groupPairs.forEach(gP => {
    finalGroups = collapseGroups(finalGroups.slice());
    let foundIdx = finalGroups.findIndex(fg => (fg.indexOf(gP[0]) > -1 || fg.indexOf(gP[1]) > -1));
    if(foundIdx > -1){
      gP.forEach(gPC => {
        if(finalGroups[foundIdx].indexOf(gPC) === -1){
          finalGroups[foundIdx] = finalGroups[foundIdx].concat(gPC);
        }
      })
    }else{
      finalGroups.push(gP);
    }
  })

  return finalGroups;
} 

const doesOverlap = (bA, bB) => {
  return bA.top <= bB.bottom && bA.bottom >= bB.top && bA.left <= bB.right && bA.right >= bB.left;
}

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
  let newPos = {
    x: Math.random() * 500,
    y: Math.random() * 500
  }

  return {
    cardIdx: cardIdx,
    deckIdx: randIdx,
    info: deck[randIdx],
    status: null,
    layer: topLayer++,
    position: newPos
  }
}

const produceBounds = position => {
  return {
    left: position.x - O.W,
    top: position.y - O.H,
    right: position.x + O.W,
    bottom: position.y + O.H
  }
}

function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ hand, setHandRaw ] = useState([]);
  // const [ deck, setDeck ] = useState(data.cards);
  const [ deck, setDeck ] = useState(createTraditionalDeck());
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);

  const setHand = useCallback((hand) => {
    const stacks = calcStacks(hand);
    setStacks(stacks);
    
    setHandRaw(hand.map(c => ({
      ...c,
      stackIdx: stacks.findIndex(s => s.indexOf(c.cardIdx) > -1)
    })));
  }, [ setHandRaw, setStacks ]);

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
        firstCard: () => getCardAtIdx(deck, 0),
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
