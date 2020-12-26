import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../store/context';
import { getShadow } from '../themes/index';

const S = {};

const HOLD_OFFSET = {
  x: -75,
  y: -100
}

S.Card = styled.div`
  background-color: ${p => p.theme || 'white'};
  border-radius:1rem;
  color:black;
  width:10rem;
  height:15rem;
  margin:2rem;
  transition: width .2s, height .2s;

  display:inline-block;
  box-shadow: ${getShadow('z3')};
  /* transition: top .3s, left .3s; */
  position:relative;

  ${p => p.manualPlacement && css`
    position:fixed;
  `}

  ${p => p.isDragging && css`
    width: 16rem;
    height: 24rem;
    z-index:1;
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

function Card({ data, theme='white' }) {
  const { setCardPosition } = useContext(StoreContext);

  const [ state, setState ] = useState({
    isDragging: false,
    dragPosition: {
      x: 0,
      y: 0
    }
  });

  const onMouseDown = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,

      isDragging:true,
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

      isDragging:false,
      dragPosition:{
        x: clientX + HOLD_OFFSET.x,
        y: clientY + HOLD_OFFSET.y
      }
    }));

    setCardPosition(data.cardIdx, {
      x: clientX + HOLD_OFFSET.x,
      y: clientY + HOLD_OFFSET.y
    });
  }, [ data.cardIdx, setCardPosition ]);

  
  useEffect(() => {
    if(state.isDragging){
      global.addEventListener('mousemove', onMouseMove);
      global.addEventListener('mouseup', onMouseUp);
    }else{
      global.removeEventListener('mousemove', onMouseMove);
      global.removeEventListener('mouseup', onMouseUp);
    }
  }, [ state.isDragging, onMouseMove, onMouseUp ])

  let position = {
    x: data.position.x,
    y: data.position.y
  }
  if(state.isDragging){
    position.x = state.dragPosition.x;
    position.y = state.dragPosition.y;
  }

  return (
    <S.Card 
      theme={theme} 
      manualPlacement={data.manualPlacement} 
      isDragging={state.isDragging}
      onMouseDown={onMouseDown}
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
