import React, { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import ActiveCard from '../../components/card/active-card';
import { getColor } from '../../themes/index';
import DrawZone from './components/draw-zone';
import DropZone from './components/drop-zone';
import HandZone from './components/hand-zone';
import RoundZone from './components/round-zone';
import InfoZone from './components/info-zone';
import { CARDSTATUS } from '../../utils/constants';

import useDebounce from '../../utils/use-debounce';


const S = {};
S.Board = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  text-align:center;
  z-index:2;
`;

S.PlayArea = styled.div`
  position:relative;
  width:100%;
  height:100%;
  overflow:hidden;
`;

S.DrawZone = styled.div`
  position:absolute;
  z-index:99999999;
  top:1rem;
  left:1rem;
`;

S.RoundZone = styled.div`
  position:absolute;
  z-index:99999999;
  top:1rem;
  left:16rem;
  right:20rem;
`;

S.InfoZone = styled.div`
  position:absolute;
  z-index:99999999;
  top:-12rem;
  right:-10rem;
  width: 30rem;
  height: 30rem;
  pointer-events:none;
`;

S.StackInfoZone = styled.div`
  position:absolute;
  z-index:1;
  bottom: 0rem;
  right: 0rem;
  width: 46rem;
  height: 30rem;
`;

S.DiscardZone = styled.div`
  position:absolute;
  bottom:0rem;
  left:0rem;
  width: 100%;
  height: 13rem;
`;

S.Bg = styled.div`
  position: absolute;
  top:0;
  left:0;
  background-color: ${getColor('black')};
  width:100%;
  height:100%;
  z-index:-9999999;
`;

S.BgImage = styled.img`
  width: 2000px;
  top:0;
  left:0;
`;

S.CardContainer = styled.div``;

S.HeldCardContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
`;

function Board() {
  const { actions, hand, dataLoaded } = useContext(StoreContext);
  const [ mouseCoords, setMouseCoords ] = useState(null);

  /* unhovering stack makes the highlight go away */
  const onBgMouseOver = useCallback(() => {
    actions.setFocusedStackIdx(-1);
    actions.setFocusedCardIdx(-1);
  }, [ actions.setFocusedStackIdx, actions.setFocusedCardIdx ]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packUrl = urlParams.get('pack');
    if(packUrl){
      actions.loadData(packUrl);
    }else{
      actions.loadData();
    }
  }, [ actions.loadData ]);

  const cardsOnTable = useMemo(() => 
    hand.filter(h => h.status > CARDSTATUS.HAND && h.status < CARDSTATUS.DISCARDED),
    [ hand ]
  );
  const debouncedCoords = useDebounce(mouseCoords, 50);

  useEffect(() => {
    actions.setMouseCoords(debouncedCoords);
  }, [ debouncedCoords, actions.setMouseCoords ]);       

  if(!dataLoaded){
    return <h1>{'Loading...'}</h1>
  }

  return (
    <S.Board onMouseMove={e => setMouseCoords({x: e.clientX, y: e.clientY})}>
      <HandZone />
      <S.DrawZone>
        <DrawZone />
      </S.DrawZone>
      <S.RoundZone>
        <RoundZone />
      </S.RoundZone>
      <S.InfoZone>
        <p>{'info'}</p>
        <InfoZone />
      </S.InfoZone>
      <S.DiscardZone>
        <DropZone action={'discard'} />
      </S.DiscardZone>

      <S.CardContainer id="cc">
        {cardsOnTable.map((c, idx) => 
          <ActiveCard data={c} key={c.cardIdx} />
        )}
      </S.CardContainer>
      
      <S.Bg onMouseOver={onBgMouseOver}>
        <S.BgImage src={'./assets/bg/space.jpg' } />
      </S.Bg>
    </S.Board>
  );
}

export default Board;
