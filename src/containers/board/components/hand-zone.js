import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import HandCard from '../../../components/card/hand-card';
import { CARDSTATUS } from '../../../utils/constants';

const S = {};

S.Hand = styled.div`
  position:absolute;
  width:100%;
  height:20rem;
  bottom:0px;

  background-color:black;
`;

function Hand() {
  const { hand } = useContext(StoreContext);

  const cardsInHand = useMemo(() => {
      const validCards = hand.filter(h => h.status === CARDSTATUS.HAND).map((c, idx) => ({
        ...c,
        handPosition: idx
      }));
      return validCards;
    },
    [ hand ]
  );
  // const cardsInHand = [];

  return (
    <S.Hand id="hand">
      {cardsInHand.map(c => (
        <HandCard data={c} key={c.cardIdx} />
      ))}
    </S.Hand>
  );
}

export default Hand;
