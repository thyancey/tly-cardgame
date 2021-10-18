import React, { useState, useCallback } from 'react';
import { StoreContext } from './context';
import StackHelper from './helpers/stack';
import DeckMaker from './helpers/deckmaker';
import GameMaster from './helpers/gamemaster';
import DataHelper from './helpers/data';
import { CARDSTATUS } from '../utils/constants';

let topLayer = 0;

// const DEFAULT_PACK = 'sample';
const DEFAULT_PACK = 'traditional';


function Store({children}) {
  const [ holdingIdx, setHoldingIdx ] = useState(-1);
  const [ focusedStackIdx, setFocusedStackIdx ] = useState(-1);
  const [ tooltipCoords, setTooltipCoords ] = useState(null);
  const [ mouseCoords, setMouseCoords ] = useState(null);
  const [ focusedCardIdx, setFocusedCardIdx ] = useState(-1);
  const [ hand, setHandRaw ] = useState([]);
  const [ deck, setDeck ] = useState([]);
  const [ zones, setZones ] = useState([]);
  const [ stacks, setStacks ] = useState([]);
  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [ roundData, setRoundData ] = useState({});

  const setAllRoundData =  useCallback(newRoundIdx => {
    setRoundData(GameMaster.getRoundData(newRoundIdx));
  }, [ setRoundData ]);

  const loadData = useCallback(packName => {
    packName = packName || DEFAULT_PACK;

    const dataUrl = `./packs/${packName}/data.json`;
    // console.log('loading data from ', dataUrl);
    DataHelper.loadData(dataUrl, (data) => {
      try{
        console.log('heres your data', data);
        GameMaster.setRoundData(data.pack.rounds);
        GameMaster.setCardPackData(data.pack.cards, data.pack.scoreMap, data.pack.name);

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
  }, [ setAllRoundData, discardHand ]);

  const dropCardStatus = (status, location) => {
    if(CARDSTATUS[location]){
      return CARDSTATUS[location];
    };

    if(status === CARDSTATUS.HAND_HOLDING){
      return CARDSTATUS.HAND;
    }else if(status === CARDSTATUS.TABLE_HOLDING){
      return CARDSTATUS.TABLE;
    }else{
      return status;
    }
  }

  const holdCardStatus = status => {
    if(status === CARDSTATUS.HAND){
      return CARDSTATUS.HAND_HOLDING;
      // return CARDSTATUS.TABLE;
    }else if(status === CARDSTATUS.TABLE){
      return CARDSTATUS.TABLE_HOLDING;
    }else{
      return status;
    }
  }

  const holdCard = useCallback((cardIdx, position) => {
    setHoldingIdx(cardIdx);

    setHand(hand.map(c => {
      if(c.cardIdx === cardIdx){
        return {
          ...c,
          status:holdCardStatus(c.status),
          position: position ? position : c.position
        }
      }else{
        const droppedStatus = dropCardStatus(c.status);
        if(c.status !== droppedStatus){
          return {
            ...c,
            status: droppedStatus
          }
        }else{
          return c;
        }
      }
    }));
  }, [ setHoldingIdx, hand, setHand ]);

  const placeCardInHand = useCallback(cardIdx => {
    setHand(hand.map(c => {
      if(c.cardIdx === cardIdx){
        return {
          ...c,
          status:CARDSTATUS.HAND
        }
      }
      return c;
    }));
  }, [ setHoldingIdx, hand, setHand ]);

  const setFocusedStackIdxHelper = useCallback((focusedIdx, tooltipCoords) => {
    setFocusedStackIdx(focusedIdx);
    if(tooltipCoords){
      setTooltipCoords(tooltipCoords);
    }else{
      setTooltipCoords(null);
    }
  }, [ setFocusedStackIdx, setTooltipCoords ]);

  /*
  const dropCard = useCallback((cardIdx, location, newPosition) => {
    // console.log('drop ', cardIdx);
    setHoldingIdx(-1);
    if(cardIdx === holdingIdx){
      setHoldingIdx(-1);
    }

    setHand(hand.map(c => {
      if(c.cardIdx === cardIdx){
        return {
          ...c,
          status:dropCardStatus(c.status, location),
          layer: topLayer++,
          position: newPosition ? {
            x: newPosition.x,
            y: newPosition.y
          } : c.position
        }
      }
      
      return c;
    }));
  }, [ setHoldingIdx, hand, setHand, holdingIdx ]);
  */

  const dropCard = useCallback((cardIdx, location, newPosition) => {
    // console.log('drop ', cardIdx);
    setHoldingIdx(-1);
    if(cardIdx === holdingIdx){
      setHoldingIdx(-1);
    }

    const foundCard = hand.find(c => c.cardIdx === cardIdx);
    if(foundCard && location === 'TABLE'){
      let activeZones = [];
      if(foundCard){
        activeZones = getZonesAtPosition(newPosition, zones);
      }

      if(activeZones.find(az => az.id === 'hand')){
        placeCardInHand(cardIdx);

        return;
      }
    }

    setHand(hand.map(c => {
      if(c.cardIdx === cardIdx){
        return {
          ...c,
          status:dropCardStatus(c.status, location),
          layer: topLayer++,
          position: newPosition ? {
            x: newPosition.x,
            y: newPosition.y
          } : c.position
        }
      }
      
      return c;
    }));
  }, [ setHoldingIdx, hand, setHand, holdingIdx, zones, placeCardInHand ]);

  return (
    <StoreContext.Provider 
      value={{
        dataLoaded: dataLoaded,
        deck: deck,
        hand: hand,
        stacks: stacks,
        zones: zones,
        roundData: roundData,
        holdingIdx: holdingIdx,
        focusedStackIdx: focusedStackIdx,
        focusedCardIdx: focusedCardIdx,
        tooltipCoords: tooltipCoords,
        mouseCoords: mouseCoords,
        actions:{
          nextRound: nextRound,
          prevRound: prevRound,
          setRound: setRound,
          dealHand: dealHand,
          dealCard: dealCard,
          discardCard: discardCard,
          discardRandomCard: discardRandomCard,
          discardHand: discardHand,
          loadData: loadData,
          setZone: setZone,
          setHoldingIdx: setHoldingIdx,
          setFocusedStackIdx: setFocusedStackIdxHelper,
          setFocusedCardIdx: setFocusedCardIdx,
          setMouseCoords: setMouseCoords,
          holdCard: holdCard,
          dropCard: dropCard,
          placeCardInHand: placeCardInHand,
        }
      }}>
        {children}
    </StoreContext.Provider>
  );
}

export default Store;
