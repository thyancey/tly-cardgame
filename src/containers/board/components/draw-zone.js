import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import MetaHelper from '../../../store/helpers/meta';
import { getColor } from '../../../themes/index';

const S = {};

S.Container = styled.div`
  width:15rem;
  min-height:22rem;
  padding:2rem;
`;

S.BasicButton = styled.div`
  padding: .5rem 1.5rem;
  font-size: 1rem;
  background-color: ${getColor('purple')};
  border-radius: 1rem;
  width: 100%;
  font-weight: bold;
  cursor:pointer;

  border: .5rem solid ${getColor('white')};
  color:${getColor('white')};
  &:first-child{
    margin-top:0;
  }
  margin-top: .5rem;

  &:hover{
    background-color: ${getColor('green')};
    /* color:${getColor('blue')}; */
    box-shadow: 0 0 1rem .2rem white;
  }
`;

S.Bg = styled.div`
  position:absolute;
  z-index:-1;
  left:0;
  top:0;
  right:0;
  bottom:0;
  border-radius: 2rem;
  border: 1rem solid white;
`;

S.ZoneText = styled.p`
  position:absolute;
  padding-top: 1rem;
  top:100%;
  width:100%;
  left:0;
  text-align:center;
  color:${getColor('white')}
`;

function DrawZone() {
  const { dealHand, dealCard, discardRandomCard, discardHand } = useContext(StoreContext);

  return (
    <S.Container >
      <S.BasicButton onClick={() => dealHand()} role="button">
        {'DEAL'}
      </S.BasicButton>
      <S.BasicButton onClick={() => dealCard(1)} role="button">
        {'DRAW 1 MORE'}
      </S.BasicButton>
      <S.BasicButton onClick={() => discardHand()} role="button">
        {'DISCARD ALL'}
      </S.BasicButton>
      <hr/>
      <S.BasicButton onClick={() => dealCard(10)} role="button">
        {'HIT 10'}
      </S.BasicButton>
      <S.BasicButton onClick={() => discardRandomCard()} role="button">
        {'DISCARD RANDOM'}
      </S.BasicButton>
      <S.ZoneText>{'DRAW'}</S.ZoneText>
      <S.Bg />
    </S.Container>
  );
}

export default DrawZone;
