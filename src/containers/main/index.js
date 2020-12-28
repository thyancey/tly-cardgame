import React from 'react';
import Board from '../board';
import Store from '../../store';
import styled from 'styled-components';
import { getColor } from '../../themes/index';
import Debug from '../board/components/debug';

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

S.DebugContainer = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:10%;
  bottom:0;
  overflow-y:auto;
`;

function Main() {
  return (
    <S.Container>
      <Store>
        <S.Header>
          {'Some dumb cardgame...'}
        </S.Header>
        <Board />
        <S.DebugContainer>
          <Debug/>
        </S.DebugContainer>
      </Store>
    </S.Container>
  );
}

export default Main;
