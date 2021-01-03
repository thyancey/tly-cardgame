import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import MetaHelper from '../../../store/helpers/meta';
import { getColor, mixinFontFamily } from '../../../themes/index';

import InfoCard from '../../../components/card/infocard';

const S = {};

S.Container = styled.div`
  pointer-events:none;
`;

S.Bg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index:-1;
`;

S.BgShape = styled.div`
  position:absolute;
  left:0;
  top:0;
  width:60rem;
  height:60rem;
  border: 2rem solid ${getColor('white')};
  background-color:${getColor('blue')};
  border-radius: 50%;

  &:hover{
    box-shadow: 0 0 1rem .2rem ${getColor('white')};
  }
`;

S.BgText = styled.img`
  position:absolute;
  left:4rem;
  top:4rem;
  right:0;
  bottom:0;
  width: 324px;
  height: 242px;
  z-index:1;
  pointer-events:none;
`;


S.StackEntry = styled.div`
  position:absolute;
  right:1rem;
  bottom:1rem;
  
  width:40rem;
  height:20rem;
`;

S.StackEntryBody = styled.div`
  height:15rem;
  width:100%;
`;

S.StackEntryDivider = styled.hr`
  border-color: ${getColor('white')};
  width: 50%;
  padding:0;
  margin:0 auto;
`;

S.StackEntryFooter = styled.div`
  margin-top:1.5rem;
  height:4rem;
  width:100%;
  display:flex;
  align-items:baseline;

  >div{
    height:100%;
  }
`;

S.SubScore = styled.div`
  text-align:right;
  flex:1;
`;

S.SubScoreValue = styled.span`
  font-size: 3rem;
  color: ${getColor('ui_blue')};
`;

S.SubScoreMultiplier = styled.div`
  >span{
    &:nth-child(1){
    color: ${getColor('ui_green')};
    }
    &:nth-child(2){
      color: ${getColor('white')};
    }
  }
`;

S.TotalScore = styled.div`
  text-align:left;
  margin-left:.5rem;
  white-space:nowrap;

  >span{
    &:nth-child(1){
      font-size: 2rem;
      line-height: 2rem;
      color: ${getColor('white')};
    }
    &:nth-child(2){
      font-size: 5rem;
      line-height: 4rem;
      color: ${getColor('ui_yellow')};
      text-shadow: 2px 2px 4px ${getColor('black')};
    }
  }
`;

S.StackPreview = styled.div`
  display:inline-block;
  vertical-align:bottom;
  width:35%;
  height:100%;

  position:relative;
`;

S.StackPreviewCenterer = styled.ul`
  list-style:none;
  padding:0;
  margin:0;

  position: absolute;
  right: 25%;
  bottom: 25%;
  transform: translate(-50%, -50%);
`;

S.StackMeta = styled.ul`
  display:inline-block;
  vertical-align:bottom;
  width:65%;

  list-style:none;
  margin:0;
  padding:0;
`;

S.MetaLine = styled.li`
  >div{
    display:inline-block;
    vertical-align:bottom;
  }

`;

S.MetaLineLeft = styled.div`
  width:40%;
  text-align:right;

  span{
    font-size:3rem;
    line-height:4rem;
    color:${getColor('ui_blue')};
  }
`;

S.MetaLineRight = styled.div`
  width:60%;
  text-align:left;
  padding-left:1rem;
`;

S.MetaTag = styled.p`
  font-size:1rem;
  margin-bottom:-1rem;
  color:${getColor('white')};
`;
S.MetaValue = styled.p`
  font-size:2rem;
  color:${getColor('ui_green')};
`;

const makeLittleCards = cards => {
  const xDelta = 25;
  const degDelta = 10;
  const yDelta = 3;
  const startX = xDelta - (cards.length * xDelta) / 2;
  const startDeg = 0 - (cards.length * degDelta) / 2;
  const halfIdx = Math.floor(cards.length / 2);

  return cards.map((c, cIdx) => {
    const x = startX + (cIdx * xDelta);
    const deg = startDeg + (cIdx * degDelta);
    const y = Math.abs(halfIdx - cIdx) * yDelta;
    const translateString = `translate(${x}px, ${y}px) rotate(${deg}deg)`;
    return (
      <li key={cIdx} style={{transform: translateString}}>
        <InfoCard data={c} />
      </li>
    )
  })
}

function MetaLine({ data }){
  return (
    <S.MetaLine>
      <S.MetaLineLeft><span>{data.score}</span></S.MetaLineLeft>
      <S.MetaLineRight>
        <S.MetaTag>{`${data.tag}`}</S.MetaTag>
        <S.MetaValue>{data.value}</S.MetaValue>
      </S.MetaLineRight>
    </S.MetaLine>
  )
}

function StackEntry({ label, idx, count, cards, score, subScore, meta }) {
  return (
    <S.StackEntry>
      <S.StackEntryBody>
        <S.StackPreview>
          <S.StackPreviewCenterer>
            { makeLittleCards(cards) }
          </S.StackPreviewCenterer>
        </S.StackPreview>
        <S.StackMeta>
          {meta.map((m, i) => <MetaLine key={i} data={m} />)}
        </S.StackMeta>
        <S.StackEntryDivider/>
      </S.StackEntryBody>
      <S.StackEntryFooter>
        <S.SubScore>
          <S.SubScoreMultiplier>
            <span>{count}</span>
            <span>{` cards x `}</span>
          </S.SubScoreMultiplier>
          <S.SubScoreValue>{subScore}</S.SubScoreValue>
        </S.SubScore>
        <S.TotalScore>
          <span>{'= '}</span>
          <span>{score}</span>
        </S.TotalScore>
      </S.StackEntryFooter>
    </S.StackEntry>
  );
}

function StackInfo() {
  const { stacks, hand, focusedStackIdx } = useContext(StoreContext);
  const completeStacks = useMemo(() => 
    MetaHelper.calcCompleteStacks(stacks, hand),
    [ stacks, hand ]
  );

  const stack = useMemo(() => 
    completeStacks.find(stack => stack.idx === focusedStackIdx),
    [ completeStacks, focusedStackIdx ]
  );

  return (
    <S.Container >
      {stack && (
        <StackEntry 
          cards={stack.cardDetails}
          idx={stack.idx}
          label={ StackHelper.getStackLabel(stack.idx) }
          count={stack.count}
          score={stack.score}
          subScore={stack.subScore}
          meta={stack.meta} />
      )}
      <S.Bg>
        <S.BgText src={'./assets/bg/stack-details-text.png'}/>
        <S.BgShape />
      </S.Bg>
    </S.Container>
  );
}

export default StackInfo;
