import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import SimpleCard from '../../components/card/simple';
import { getColor } from '../../themes/index';
import DrawZone from './components/draw-zone';
import DropZone from './components/drop-zone';
import StackZone from './components/stack-zone';
import ScoreInfo from './components/scoreinfo';

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
  /* background-color: ${getColor('purple')}; */
  width:100%;
  height:100%;
  z-index:-1;
`;

S.BgImage = styled.img`
  width: 2000px;
  top:0;
  left:0;

  /* opacity:.5; */
`;

function Board() {
  const { hand, setFocusedStackIdx } = useContext(StoreContext);
  const onBgMouseOver = useCallback(() => {
    // setFocusedStackIdx(-1);
  }, [ setFocusedStackIdx ]);

  return (
    <S.Board>
      <S.DrawZone>
        <DrawZone />
      </S.DrawZone>
      <S.InfoZone>
        <p>{'info'}</p>
        <ScoreInfo />
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
