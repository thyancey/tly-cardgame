import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import { getColor } from '../../../themes/index';
import GameMaster from '../../../store/helpers/gamemaster';

const S = {};

S.Container = styled.div`
  /* padding:1rem; */
`;

S.Bg = styled.div`
  position:absolute;
  z-index:-1;
  left:0;
  top:0;
  right:0;
  bottom:0;
`;

S.TextArea = styled.div`
  position:absolute;
  padding-top: 1rem;
  top:100%;
  width:100%;
  left:0;
  text-align:center;
  color:${getColor('white')}
`;


S.ZoneText = styled.p`

`;
S.CardCount = styled.p`
  font-size:1rem;
`;

S.BasicButton = styled.div`
  display:inline-block;
  padding: .5rem 1.5rem;
  margin:.5rem;
  font-size: 1rem;
  background-color: ${getColor('purple')};
  border-radius: 1rem;
  font-weight: bold;
  cursor:pointer;

  border: .5rem solid ${getColor('white')};
  color:${getColor('white')};
  &:first-child{
    margin-top:0;
  }

  &:hover{
    background-color: ${getColor('green')};
    /* color:${getColor('blue')}; */
    box-shadow: 0 0 1rem .2rem white;
  }

  ${p => p.isActive && css`
    background-color: ${getColor('blue')};
  `}
`;

function RoundButton({ roundIdx, onClick, isActive }){
  return(
    <S.BasicButton isActive={isActive} onClick={() => onClick(roundIdx)} role="button">
      {`${roundIdx + 1}`}
    </S.BasicButton>
  )
}

function RoundZone() {
  const { nextRound, prevRound, roundData, setRound, deck, hand } = useContext(StoreContext);

  const renderRounds = (count) => {
    let buttons = [];
    for(let i = 0; i < count; i++){
      buttons.push(
        <RoundButton 
          key={i}
          roundIdx={i} 
          isActive={roundData.idx === i}
          onClick={() => setRound(i)} 
        />
      );
    }
    return buttons;
  }

  const numCardsInDrawPile = useMemo(() => 
    deck.length - hand.length, 
    [ deck.length, hand.length ]
  );

  return (
    <S.Container >
      <S.BasicButton onClick={() => prevRound()} role="button">
        {'-'}
      </S.BasicButton>
      { renderRounds(GameMaster.getNumRounds()) }
      <S.BasicButton onClick={() => nextRound()} role="button">
        {'+'}
      </S.BasicButton>
      <S.TextArea>
        <S.ZoneText>{`Round: ${roundData.idx + 1}: "${roundData.title}"`}</S.ZoneText>
        <S.CardCount>{`${numCardsInDrawPile} cards left`}</S.CardCount>
      </S.TextArea>
      <S.Bg />
    </S.Container>
  );
}

export default RoundZone;
