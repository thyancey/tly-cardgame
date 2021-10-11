import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
// import HandCard from '../../../components/card/hand';
import SimpleCard from '../../../components/card/simple';
import { CARDSTATUS } from '../../../utils/constants';

const S = {};

S.Hand = styled.div`
  position:absolute;
  width:100%;
  height:20rem;
  ${'' /* bottom:0px; */}

  background-color:black;
`;

function Hand() {
  const { hand } = useContext(StoreContext);

  const cardsInHand = useMemo(() => {
      const validCards = hand.filter(h => h.status >= CARDSTATUS.HAND && h.status <= CARDSTATUS.HAND_HOLDING).map((c, idx) => ({
        ...c,
        handPosition: idx
      }));
      return validCards;
    },
    [ hand ]
  );

  return (
    <S.Hand id="hand">
      {cardsInHand.map(c => (
        <SimpleCard data={c} key={c.cardIdx} />
      ))}
    </S.Hand>
  );
}

export default Hand;
