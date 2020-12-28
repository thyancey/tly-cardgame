import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../store/context';
import { getShadow } from '../themes/index';

const S = {};

// const HOLD_OFFSET = {
//   x: -100,
//   y: -140
// }
// const DROP_OFFSET = {
//   x: -70,
//   y: -95
// }

const HOLD_OFFSET = {
  x: 0,
  y: 0
}
const DROP_OFFSET = {
  x: 0,
  y: 0
}

S.Card = styled.div`
  background-color: ${p => p.theme || 'white'};
  border-radius:1rem;
  color:black;

  /* margin:7.5rem 5rem; */
  box-shadow: ${getShadow('z3')};

  position:fixed;

  z-index: ${p => p.depth};
  ${p => p.isDragging && css`
    z-index:1000;
  `}

  p{
    position:absolute;
    top:100%;
    width:100%;
    text-align:center;
    margin-top:.5rem;
    font-weight:bold;
  }
`;

S.InnerCard = styled.div`
  position:absolute;
  width:10rem;
  height:15rem;
  transform-origin: 50% 50%;
  left: -5rem;
  top: -7.5rem;
  /* transform: translate(-50%, -50%); */
  /* transition: transform .2s cubic-bezier(.42,.05,.86,.13), opacity .2s; */
    transition: transform .3s cubic-bezier(1,.05,.32,1.2), opacity .3s;


  ${p => p.isDragging && css`
  transform: scaleX(2) scaleY(2);
    ${'' /* width: 16rem;
    height: 24rem; */}
    opacity: .5;
    ${'' /* transition: transform .4s cubic-bezier(1,.05,.32,1.2), opacity .2s; */}
    transition: transform .1s cubic-bezier(.42,.05,.86,.13), opacity .2s;
  `}
`;

S.Background = styled.img`
  background-size: contain;
  width:100%;
  border-radius:1rem;
`;

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

function Card({ data, theme='white' }) {
  const { setCardPosition } = useContext(StoreContext);

  const [ state, setState ] = useState({
    dragPosition: null
  });

  const onMouseDown = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX + HOLD_OFFSET.x,
        y: clientY + HOLD_OFFSET.y
      }
    }))
  }, []);

  const onMouseMove = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX + HOLD_OFFSET.x,
        y: clientY + HOLD_OFFSET.y
      }
    }));

  }, []);

  const onMouseUp = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition:null
    }));

    setCardPosition(data.cardIdx, {
      x: clientX + DROP_OFFSET.x,
      y: clientY + DROP_OFFSET.y
    });
  }, [ data.cardIdx, setCardPosition ]);

  
  useEffect(() => {
    if(!!state.dragPosition){
      global.addEventListener('mousemove', onMouseMove);
      global.addEventListener('mouseup', onMouseUp);
    }else{
      global.removeEventListener('mousemove', onMouseMove);
      global.removeEventListener('mouseup', onMouseUp);
    }
  }, [ state.dragPosition, onMouseMove, onMouseUp ])

  let position = usePosition(data.position, state.dragPosition);

  return (
    <S.Card 
      theme={theme} 
      manualPlacement={data.manualPlacement} 
      isDragging={!!state.dragPosition}
      onMouseDown={onMouseDown}
      depth={data.layer}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <S.InnerCard isDragging={!!state.dragPosition}>
        <S.Background src={data.info.imageUrl} draggable={false} />
        <p>{data.info.title}</p>
      </S.InnerCard>
    </S.Card>
  );
}

export default Card;
