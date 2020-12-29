import React, { useContext } from 'react';
import styled from 'styled-components';
import { StoreContext } from '../../store/context';
import Card from '../../components/card';
import { getColor } from '../../themes/index';
import DropZone from './components/drop-zone';

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
  background-color:${getColor('grey')};
`;

S.BasicButton = styled.button`
  padding: .5rem 1.5rem;
  font-size: 1rem;
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
  const { dealHand, dealCard, discardRandomCard, discardHand, hand } = useContext(StoreContext);

  return (
    <S.Board>
      <S.DrawZone>
        <S.BasicButton onClick={() => dealHand(10)}>
          {'deal only 10'}
        </S.BasicButton>
        <S.BasicButton onClick={() => dealCard(10)}>
          {'deal 10 more'}
        </S.BasicButton>
        <S.BasicButton onClick={() => dealCard(1)}>
          {'deal one'}
        </S.BasicButton>
        <S.BasicButton onClick={() => discardRandomCard()}>
          {'discard random'}
        </S.BasicButton>
        <S.BasicButton onClick={() => discardHand()}>
          {'discard hand'}
        </S.BasicButton>
      </S.DrawZone>
      <S.InfoZone>
        <p>{'info'}</p>
      </S.InfoZone>
      <S.DiscardZone>
        <DropZone action={'discard'} />
      </S.DiscardZone>

      {hand.map((c, idx) => 
        <Card data={c} key={c.cardIdx} />
      )}

      <S.FooterZone>
        <p>{'some info text here'}</p>
      </S.FooterZone>
      
    </S.Board>
  );
}

export default Board;
