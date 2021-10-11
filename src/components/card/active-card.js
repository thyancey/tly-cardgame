import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { StoreContext } from '../../store/context';
import { CARDSTATUS } from '../../utils/constants';
import Card from './card';

const S = {};

function usePosition(restingPosition, dragPosition, status){
  if(status === CARDSTATUS.HAND){
    return {
      x: 0,
      y: 0
    }
  }

  if(!!dragPosition){
    return {
      x: dragPosition.x,
      y: dragPosition.y
    }
  }else{
    return {
      x: restingPosition.x,
      y: restingPosition.y
    }
  }
}

function ActiveCard({ data, theme='white' }) {
  const { actions, focusedStackIdx } = useContext(StoreContext);

  const [ state, setState ] = useState({
    dragPosition: null
  });

  const cardRef = useRef(null);

  
  const onMouseOver = useCallback((e, stackIdx) => {
    actions.setFocusedStackIdx(stackIdx);
  }, [ actions.setFocusedStackIdx ]);


  const onMouseDown = useCallback(({ clientX, clientY }, cardIdx) => {
    actions.holdCard(cardIdx);
    // console.log('hold', cardIdx)
    // console.log('dragPosition', {
    //   x: clientX,
    //   y: clientY
    // })

    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX,
        y: clientY
      }
    }));
  }, [ actions.holdCard ]);

  const onMouseDraggingCard = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX,
        y: clientY
      }
    }));

  }, []);

  const onMouseDroppedCard = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition:null
    }));

    // console.log('simple: mouseDropped', data.cardIdx);
    actions.dropCard(data.cardIdx, 'TABLE', {
      x: clientX,
      y: clientY
    });

  }, [ data.cardIdx, actions.dropCard ]);

  useEffect(() => {
    if(!!state.dragPosition){
      cardRef.current.addEventListener('mouseleave', onMouseDroppedCard);
      cardRef.current.addEventListener('mousemove', onMouseDraggingCard);
      cardRef.current.addEventListener('mouseup', onMouseDroppedCard);
    }else{
      cardRef.current.removeEventListener('mouseleave', onMouseDroppedCard);
      cardRef.current.removeEventListener('mousemove', onMouseDraggingCard);
      cardRef.current.removeEventListener('mouseup', onMouseDroppedCard);
    }
  }, [ state.dragPosition, onMouseDraggingCard, onMouseDroppedCard ])

  let position = usePosition(data.position, state.dragPosition, data.status);

  const stackStyle = useMemo(() => 
    {
      if(data.stackIdx === -1){
        return null;
      }else{
        if(focusedStackIdx === data.stackIdx){
          return 'focused';
        }else{
          return 'stacked';
        }
      }
    },
    [ data.stackIdx, focusedStackIdx ]
  );

  return (
    <Card
      data={data}
      theme={theme} 
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      cardRef={cardRef}
      inHand={false}
      position={position}
      dragPosition={state.dragPosition}
      stackStyle={stackStyle} >
    </Card>
  );
}

export default ActiveCard;
