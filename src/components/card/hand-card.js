import React, { useState, useContext, useCallback, useRef } from 'react';
import { StoreContext } from '../../store/context';
import Card from './card';

const S = {};

function HandCard({ data, theme='white' }) {
  const { actions } = useContext(StoreContext);

  const [ state, setState ] = useState({
    dragPosition: null
  });

  const cardRef = useRef(null);
  
  const onMouseOver = useCallback((e, cardIdx, stackIdx) => {
    actions.setFocusedCardIdx(cardIdx);
    actions.setFocusedStackIdx(stackIdx, { x: e.clientX, y: e.clientY });
  }, [ actions.setFocusedStackIdx, actions.setFocusedCardIdx ]);


  const onMouseDown = useCallback(({ clientX, clientY }, cardIdx) => {
    actions.holdCard(cardIdx, {
      x: clientX,
      y: clientY
    });
  }, [ actions.holdCard, actions.dropCard ]);

  return (
    <Card
      data={data}
      theme={theme} 
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      cardRef={cardRef}
      inHand={true}
      position={{x:0,y:0}}
      dragPosition={state.dragPosition}
      stackStyle={'hand'} >
    </Card>
  );
}

export default HandCard;
