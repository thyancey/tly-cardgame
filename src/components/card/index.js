import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../store/context';
import { mixin_textStroke, getShadow, getColor } from '../../themes/index';
import MetaGroup from './metagroup';
import StackHelper from '../../store/helpers/stack';

const S = {};

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
  transition: transform .3s cubic-bezier(1,.05,.32,1.2), opacity .3s;
  border-radius: 1rem;

  ${p => p.isDragging && css`
    transform: scaleX(1.5) scaleY(1.5);
    opacity: .5;
    transition: transform .1s cubic-bezier(.42,.05,.86,.13), opacity .2s;
  `}
  

  ${p => p.stackColor && css`
    box-shadow: 0 0 2rem .5rem ${getColor(p.stackColor)};
    text-shadow: 0 0 .5rem ${getColor(p.stackColor)};
    color:white;
  `}
`;

S.Background = styled.img`
  background-size: contain;
  width:100%;
  border-radius:1rem;
`;

S.StackFlag = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width:3rem;
  height:3rem;
  padding-top:.5rem;

  border-radius: 50%;

  ${p => p.stackColor && css`
    box-shadow: 0 0 .2rem .5rem ${getColor(p.stackColor)};
    background-color: ${getColor(p.stackColor)};
    transition: color, 1s;
    span{
      ${ mixin_textStroke('.5px', '2px', getColor('black')) }
    }
  `}
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

function useStackColor(stackIdx) {
  switch(stackIdx){
    case -1: return null;
    case 0: return 'purple';
    case 1: return 'blue';
    case 2: return 'green';
    case 3: return 'yellow';
    case 4: return 'red';
    case 5: return 'grey';
    default: return 'black';
  }
}

function useStackSize(stackIdx, stacks){
  try{
    return stacks[stackIdx].length;
  }catch(e){
    // console.error('could not find stack at idx ', stackIdx, stacks);
    return 0;
  }
}

function Card({ data, theme='white' }) {
  const { setCardPosition, setHoldingIdx, stacks } = useContext(StoreContext);

  const [ state, setState ] = useState({
    dragPosition: null
  });

  const stackSize = useStackSize(data.stackIdx, stacks);
  const cardRef = useRef(null);

  const onMouseDown = useCallback(({ clientX, clientY }, cardIdx) => {
    setHoldingIdx(cardIdx);

    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX,
        y: clientY
      }
    }));
  }, [ setHoldingIdx ]);

  const onMouseMove = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition: {
        x: clientX,
        y: clientY
      }
    }));

  }, []);

  const onMouseUp = useCallback(({ clientX, clientY }) => {
    setState(state => ({
      ...state,
      dragPosition:null
    }));

    setCardPosition(data.cardIdx, {
      x: clientX,
      y: clientY
    }, true);
  }, [ data.cardIdx, setCardPosition ]);

  useEffect(() => {
    if(!!state.dragPosition){
      cardRef.current.addEventListener('mousemove', onMouseMove);
      cardRef.current.addEventListener('mouseup', onMouseUp);
    }else{
      cardRef.current.removeEventListener('mousemove', onMouseMove);
      cardRef.current.removeEventListener('mouseup', onMouseUp);
    }
  }, [ state.dragPosition, onMouseMove, onMouseUp ])

  let position = usePosition(data.position, state.dragPosition, cardRef);

  let stackColor = useMemo(() => StackHelper.getStackColor(data.stackIdx), [ data.stackIdx ]);

  return (
    <S.Card 
      theme={theme} 
      isDragging={!!state.dragPosition}
      onMouseDown={e => onMouseDown(e, data.cardIdx)}
      depth={data.layer}
      ref={cardRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <S.InnerCard 
        isDragging={!!state.dragPosition}
        stackColor={stackColor}
      >
        <S.Background src={data.info.imageUrl} draggable={false} />
        <p>{`(${data.cardIdx}): ${data.info.title}`}</p>
        <MetaGroup data={data.info.meta} />
        {data.stackIdx > -1 && (
          <S.StackFlag stackColor={stackColor}>
            <span>{stackSize}</span>
          </S.StackFlag>
        )}
      </S.InnerCard>
    </S.Card>
  );
}

export default Card;
