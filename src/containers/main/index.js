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
  overflow:hidden;
`;

S.DebugContainer = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:10%;
  bottom:0;
  overflow-y:auto;
`;

S.BoardBg = styled.img`
  background-size: contain;
  position: absolute;
  width: 2000px;
`;


function Main() {
  return (
    <S.Container>
      <Store>
        <Board />
        <S.BoardBg src={'./assets/bg/bg1.jpg' } />
        <S.DebugContainer>
          <Debug/>
        </S.DebugContainer>
      </Store>
    </S.Container>
  );
}

export default Main;
