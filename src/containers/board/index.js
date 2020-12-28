import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import Card from '../../components/card';
import { getColor } from '../../themes/index';

const S = {};

S.PlayArea = styled.div`
  position:relative;
  width:100%;
  height:100%;
  overflow:hidden;
`;


S.Board = styled.div`
  position:absolute;
  left:10%;
  top:10%;
  width:80%;
  height:80%;
  text-align:center;

  display: grid;
  grid-template-columns: auto 10rem;
  grid-template-rows: 20rem auto 10rem 2rem;
  grid-template-areas: 
    'g-playarea g-draw'
    'g-playarea g-info'
    'g-playarea g-discard'
    'g-footer g-discard';

  border:.2rem solid black;
  background-color:${getColor('red')};
`;

S.DealButton = styled.button`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  top:0;
  padding: .5rem 1.5rem;
  font-size: 2rem;
`;

S.DrawZone = styled.div`
  grid-area: g-draw;
  border: .2rem dashed black;
  position:relative;
`;

S.DiscardZone = styled.div`
  grid-area: g-discard;
  border: .2rem dashed black;
`;

S.FooterZone = styled.div`
  grid-area: g-footer;
  border: .2rem dashed black;
`;

S.InfoZone = styled.div`
  grid-area: g-info;
  border: .2rem dashed black;
`;


function Board() {
  const { holdingIdx, dealHand, hand } = useContext(StoreContext);

  // const holdingColor = useAlternateColors(holdingIdx);
  
  return (
    <S.Board>
      <S.DrawZone>
        <S.DealButton onClick={() => dealHand(10)}>
          {'deal'}
        </S.DealButton>
      </S.DrawZone>
      <S.InfoZone>
        <p>{'info'}</p>
      </S.InfoZone>
      <S.DiscardZone>
        <p>{'discard'}</p>
      </S.DiscardZone>

      {hand.map((h,idx) => 
        <Card data={h} key={idx} />
      )}
      
      <S.FooterZone>
        <p>{'some info text here'}</p>
      </S.FooterZone>
      
    </S.Board>
  );
}

export default Board;
