import React, { useContext, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import SimpleCard from '../../components/card/simple';
import { getColor } from '../../themes/index';
import DrawZone from './components/draw-zone';
import DropZone from './components/drop-zone';
import StackZone from './components/stack-zone';
import RoundZone from './components/round-zone';
import InfoZone from './components/info-zone';

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
  bottom:-10rem;
  left:-4rem;
  width: 274px;
  height: 274px;
`;

S.Bg = styled.div`
  position: absolute;
  top:0;
  left:0;
  background-color: ${getColor('black')};
  width:100%;
  height:100%;
  z-index:-1;
`;

S.BgImage = styled.img`
  width: 2000px;
  top:0;
  left:0;
`;

function Board() {
  const { hand, setFocusedStackIdx, dataLoaded, loadData } = useContext(StoreContext);

  /* unhovering stack makes the highlight go away */
  const onBgMouseOver = useCallback(() => {
    setFocusedStackIdx(-1);
  }, [ setFocusedStackIdx ]);

  useEffect(() => {
    console.log("only once please")
    const urlParams = new URLSearchParams(window.location.search);
    const deckUrl = urlParams.get('deck');
    if(deckUrl){
      loadData(deckUrl);
    }else{
      loadData();
    }
  }, [ loadData ]);

  if(!dataLoaded){
    return <h1>{'Loading...'}</h1>
  }

  return (
    <S.Board>
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
      <S.StackInfoZone>
        <StackZone />
      </S.StackInfoZone>

      {hand.map((c, idx) => 
        <SimpleCard data={c} key={c.cardIdx} />
      )}
      
      <S.Bg onMouseOver={onBgMouseOver}>
        {/* <S.BgImage src={'./assets/bg/bg1.jpg' } /> */}
        <S.BgImage src={'./assets/bg/space.jpg' } />
      </S.Bg>
    </S.Board>
  );
}

export default Board;
