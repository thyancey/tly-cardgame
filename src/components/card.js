import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../store/context';
import { getShadow } from '../themes/index';

const S = {};

const HOLD_OFFSET = {
  // x: -60,
  // y: -90
  x: -100,
  y: -140
}
const DROP_OFFSET = {
  x: -70,
  y: -95
}

S.Card = styled.div`
  background-color: ${p => p.theme || 'white'};
  border-radius:1rem;
  color:black;
  width:10rem;
  height:15rem;
  margin:2rem;
  transition: width .2s, height .2s, opacity .5;

  display:inline-block;
  box-shadow: ${getShadow('z3')};
  /* transition: top .3s, left .3s; */
  position:relative;

  ${p => p.manualPlacement && css`
    position:fixed;
  `}

  z-index: ${p => p.depth};
  ${p => p.isDragging && css`
    width: 16rem;
    height: 24rem;
    z-index:1000;
    opacity: .5;
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
      <div>
        <S.Background src={data.info.imageUrl} draggable={false} />
        <p>{data.info.title}</p>
      </div>
    </S.Card>
  );
}

export default Card;
