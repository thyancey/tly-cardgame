import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import MetaHelper from '../../../store/helpers/meta';
import { getColor } from '../../../themes/index';

const S = {};

S.Container = styled.div`
  width: 100%;
  height: 100%;
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
  right:0;
  bottom:0;
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

S.Header = styled.div`
`;

S.Summary = styled.div`
`;

S.StackEntry = styled.div`
  margin:.5rem;
  display:inline-block;
  vertical-align:top;
  border: 2px solid white;
  border-radius: 1rem;
  padding: .5rem;
  padding-top: .25rem;

  ${p => css`
    border-color: ${getColor(p.stackColor)};
    box-shadow: 0 0 .5rem .25rem ${getColor(p.stackColor)};
    text-shadow: 1px 1px 1px ${getColor(p.stackColor)};
  `}


  h4{
    font-weight:bold;
    font-size:1.5rem;
  }

  ul{
    list-style:none;
    /* padding-left:1rem; */
    padding:0;
    margin:0;

    li{
      margin-top:.5rem;
    }
  }
`;

S.MetaScore = styled.div`
  text-align:right;
  >span{
    /* the x */
    &:nth-child(1){
      color:${getColor('red')};
    }
    /* the score  */
    &:nth-child(2){
      color:white;
    }
  }
`;

S.MetaEntry = styled.div`
  position: relative;
  /* border: 2px solid white; */
  text-align:right;

  >div{
    display:inline-block;
    vertical-align:top;
    padding: .5rem 1rem;
    background-color: ${getColor('grey')};

    &:nth-child(1){
      border-radius: 1rem 0 0 1rem;
      margin-right:.12rem;
    }
    &:nth-child(2){
      border-radius: 0rem 1rem 1rem 0rem;
      margin-left:.12rem;
    }
  }
`;

S.MetaLeft = styled.div`
  text-align:left;
`;

S.MetaRight = styled.div`
  font-size:2rem;
  text-align:right;
  color:${getColor('yellow')};
  background-color: ${getColor('grey')};
  min-width: 7rem;
  padding-right:.5rem;
`;

function MetaEntry({ tag, value, count, score }) {

  return (
    <S.MetaEntry>
      <S.MetaLeft>
        <p>{`${tag}: ${value}`}</p>
        <S.MetaScore>
          <span>{'x '}</span>
          <span>{score}</span>
        </S.MetaScore>
      </S.MetaLeft>
      <S.MetaRight>
        <span>{count * score}</span>
      </S.MetaRight>
    </S.MetaEntry>
  );
}


function StackEntry({ label, idx, count, score, meta }) {

  return (
    <S.StackEntry stackColor={useMemo(() => StackHelper.getStackColor(idx), [ idx ])} >
      <h4>{`stack #${label}`}</h4>
      <p>{`cards: ${count}`}</p>
      <p>{`score: ${score}`}</p>
      <ul>
        { meta.map(m => (
          <li key={m.tag}>
            <MetaEntry
              tag={m.tag}
              value={m.value}
              count={m.count}
              score={m.score}
            />
          </li>
        )) }
      </ul>
    </S.StackEntry>
  );
}

function StackInfo() {
  const { stacks, hand } = useContext(StoreContext);
 
  const completeStacks = useMemo(() => 
    MetaHelper.calcCompleteStacks(stacks, hand),
    [ stacks, hand ]
  );

  return (
    <S.Container >
      <S.Summary>
        { completeStacks.map((stack, idx) => (
          <StackEntry 
            key={idx}
            idx={idx}
            label={ StackHelper.getStackLabel(idx) }
            count={stack.count}
            score={stack.score}
            meta={stack.meta} />
        ))}
      </S.Summary>
      <S.Bg>
        <S.BgText src={'./assets/bg/stack-details-text.png'}/>
        <S.BgShape />
      </S.Bg>
    </S.Container>
  );
}

export default StackInfo;
