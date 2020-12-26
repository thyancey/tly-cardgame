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
  overflow:hidden;

  background-color:${getColor('grey')};
`;


function Main() {
  return (
    <S.Container>
      <Store>
        <Board />
      </Store>
    </S.Container>
  );
}

export default Main;
