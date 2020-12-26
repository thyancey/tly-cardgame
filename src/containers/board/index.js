import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import Card from '../../components/card';
import { getColor } from '../../themes/index';

const S = {};

S.Board = styled.div`
  position:absolute;
  left:10%;
  top:10%;
  width:80%;
  height:80%;

  border:.2rem solid black;
  background-color:${getColor('red')};
`;

S.DealButton = styled.button`
  position:absolute;
  right:0;
  bottom:100%;
  padding: 1rem 2rem;
  font-size: 2rem;
`;

function useAlternateColors(holdingIdx){
  return holdingIdx % 2 === 0 ? 'red' : 'green'
}


function Board() {
  const { holdingIdx, dealHand, hand } = useContext(StoreContext);

  // const holdingColor = useAlternateColors(holdingIdx);
  
  return (
    <S.Board>
      <S.DealButton onClick={() => dealHand(10)}>
        {'deal'}
      </S.DealButton>
      {hand.map((h,idx) => 
        <Card data={h} key={idx} />
      )}
      
    </S.Board>
  );
}

export default Board;
