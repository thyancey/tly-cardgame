import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../store/context';
import { mixin_textStroke, getShadow, getColor } from '../../themes/index';

const S = {};

S.Card = styled.div`
  background-color: ${p => p.theme || 'white'};
  border-radius:1rem;
  color:black;

  position:absolute;

  z-index: ${p => p.depth};
  ${p => p.isDragging && css`
    z-index:1000;
  `}

  cursor:pointer;
`;

S.InnerCard = styled.div`
  position:absolute;
  width:10rem;
  height:15rem;
  transform-origin: 50% 50%;
  left: -5rem;
  top: -7.5rem;
  transition: transform .3s cubic-bezier(1,.05,.32,1.2), opacity .3s;
  border-radius: 1rem;
  
  box-shadow: ${getShadow('z3')};
  ${p => p.stackStyle === 'stacked' && css`
    box-shadow: 1px 3px 2px 4px ${getColor('ui_blue')};
  `}
  ${p => p.stackStyle === 'focused' && css`
    box-shadow: 1px 3px 2px 4px ${getColor('ui_green')};
  `}

  ${p => p.isDragging && css`
    transform: scaleX(1.5) scaleY(1.5);
    opacity: .5;
    transition: transform .1s cubic-bezier(.42,.05,.86,.13), opacity .2s;
  `}
`;

S.Background = styled.img`
  background-size: contain;
  width:100%;
  height:100%;
  border-radius:1rem;
`;

S.DebugStatus = styled.h3`
  color:white;
`

function usePosition(restingPosition, dragPosition){

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

function SimpleCard({ data, theme='white' }) {
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
    console.log('hold', cardIdx)
    console.log('dragPosition', {
      x: clientX,
      y: clientY
    })

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

    console.log('simple: mouseDropped', data.cardIdx);
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

  let position = usePosition(data.position, state.dragPosition, cardRef);

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
    <S.Card
      id={`card-${data.cardIdx}`} 
      theme={theme} 
      isDragging={!!state.dragPosition}
      onMouseDown={e => onMouseDown(e, data.cardIdx)}
      onMouseOver={e => onMouseOver(e, data.stackIdx)}
      depth={data.layer}
      ref={cardRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <S.InnerCard 
        isDragging={!!state.dragPosition}
        stackStyle={stackStyle}
      >
        <S.DebugStatus>{data.status}</S.DebugStatus>
        <S.Background src={data.info.imageUrl} draggable={false} />
      </S.InnerCard>
    </S.Card>
  );
}

export default SimpleCard;
