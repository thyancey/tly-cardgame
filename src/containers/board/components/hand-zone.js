import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import HandCard from '../../../components/card/hand';

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
      const inHand = hand.filter(h => h.inHand).map((c, idx) => ({
        ...c,
        handPosition: idx
      }));
      return inHand;
    },
    [ hand ]
  );

  return (
    <S.Hand id="hand">
      {cardsInHand.map(c => (
        <HandCard data={c} key={c.cardIdx} />
      ))}
    </S.Hand>
  );
}

export default Hand;
