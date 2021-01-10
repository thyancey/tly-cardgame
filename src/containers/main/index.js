import React, { useContext, useEffect } from 'react';
import Board from '../board';
import GameMaster from '../../store/helpers/gamemaster';
import DeckMaker from '../../store/helpers/deckmaker';
import Store from '../../store';
import styled from 'styled-components';

const S = {};
S.Container = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  overflow:hidden;
`;

window.gm = GameMaster;
window.dm = DeckMaker;

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
