import React from 'react';
import Board from '../board';
import Store from '../../store';
import styled from 'styled-components';
import { getColor } from '../../themes/index';

const S = {};
S.Container = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  padding:1rem;
  overflow:hidden;

  background-color:${getColor('grey')};
`;

S.Header = styled.h1`
  color:white;
`;


function Main() {
  return (
    <S.Container>
      <Store>
        <S.Header>
          {'Some dumb cardgame...'}
        </S.Header>
        <Board />
      </Store>
    </S.Container>
  );
}

export default Main;
