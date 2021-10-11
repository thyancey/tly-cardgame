import React from 'react';
import styled, { css } from 'styled-components';
import { mixin_textStroke, getShadow, getColor } from '../../themes/index';
// import InnerCard from './inner-card';

const S = {};

S.Card = styled.div`
  background-color: ${p => p.theme || 'white'};
  border-radius:1rem;
  color:black;
  cursor:pointer;
  z-index: ${p => p.depth};
  ${p => p.isDragging && css`
    z-index:1000;
  `}

  ${p => p.inHand ? css`
    display:inline-block;
    position:relative;
    width:10rem;
    height:15rem;
  `:css`
    position:absolute;
  `}
`;

S.InnerCard = styled.div`
  position:absolute;
  width:10rem;
  height:15rem;
  transform-origin: 50% 50%;
  ${p => p.inHand ? css`
    left: 0;
    top: 0;
  `:css`
    left: -5rem;
    top: -7.5rem;
  `}
  
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
  position:absolute;
  bottom:100%;
`

function AbstractCard({ onMouseDown, onMouseOver, position, cardRef, stackStyle, dragPosition, inHand, data, theme='white' }) {
  return (
    <S.Card
      id={`card-${data.cardIdx}`} 
      theme={theme} 
      isDragging={!!dragPosition}
      onMouseDown={e => onMouseDown(e, data.cardIdx)}
      onMouseOver={e => onMouseOver(e, data.stackIdx)}
      depth={data.layer}
      ref={cardRef}
      inHand={inHand}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <S.InnerCard 
        isDragging={!!dragPosition}
        inHand={inHand}
        stackStyle={stackStyle}
      >
        <S.DebugStatus>{data.status}</S.DebugStatus>
        <S.Background src={data.info.imageUrl} draggable={false} />
      </S.InnerCard>
    </S.Card>
  );
}

export default AbstractCard;
