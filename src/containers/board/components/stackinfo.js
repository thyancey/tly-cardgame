import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import MetaHelper from '../../../store/helpers/meta';
import { getColor, mixinFontFamily } from '../../../themes/index';

import InfoCard from '../../../components/card/infocard';

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

S.StackHolder = styled.div`
  padding-left:10rem;
  padding-top:15rem;
  text-align:left;
`;


S.StackEntry = styled.div`
  margin:.5rem;
  margin-bottom:4rem;
  display:inline-block;
  border-radius: 1rem;
  padding: .5rem;
  padding-top: .25rem;
  min-height: 15rem;
  width: calc(100% - 5rem);

  >div{
    display:inline-block;
    vertical-align:top;
  }

  ${p => css`
    ${'' /* border-color: ${getColor(p.stackColor)};
    box-shadow: 0 0 .5rem .25rem ${getColor(p.stackColor)};
    text-shadow: 1px 1px 1px ${getColor(p.stackColor)}; */}
  `}


  h4{
    font-weight:bold;
    font-size:1.5rem;
  }

  ul{
    list-style:none;
    padding:0;
    margin:0;
  }
`;

S.SeLeft = styled.div`
  position:relative;
  width: 25%;
`;

S.SeRight = styled.div`
  width: 75%;

  hr{
    width:66%;
    margin-left: 2rem;
    margin-top: 0rem;
    margin-bottom: -.25rem;
  }
`;


S.InfoCards = styled.ul`
  position:absolute;
  top:1rem;
  right:3rem;

  >li{
    position:absolute;
  }
`;

S.MetaEntry = styled.div`
  position: relative;
  >div{
    display:inline-block;
    vertical-align:middle;
  }
`;

S.MetaLeft = styled.div`
  width:33%;
  text-align:right;
  font-size:3rem;
  line-height: 3rem;
  padding-right: 1rem;
`;

S.MetaRight = styled.div`
  width:66%;
  text-align:left;
`;

S.MetaScoreSubTotal = styled(S.MetaLeft)`
  >span{
    &:nth-child(1){
      font-size:1rem;
      color:${getColor('ui_green')};
    }
    &:nth-child(2){
      font-size:2rem;
      color:${getColor('white')};
    }
  }
`;

S.MetaScoreModifier = styled(S.MetaLeft)`
  position:relative;
  >div{
    position:absolute;
    right:1rem;
    top:-.75rem;
    white-space:nowrap;
    span{
      &:nth-child(1){
        color:${getColor('ui_blue')};
      }
      &:nth-child(2){
        color:${getColor('white')};
      }
    }
  }
`;

S.MetaScoreTotal = styled(S.MetaRight)`
  font-size:5rem;
  color:${getColor('ui_yellow')};

  >span{
    ${mixinFontFamily('display')};
  }
`;

S.MetaScore = styled(S.MetaLeft)`
  color:${getColor('ui_blue')};
  
  >span{
    ${mixinFontFamily('display')};
  }
`;

S.MetaTag = styled(S.MetaRight)`
  color:${getColor('white')};

  >span{
    &:nth-child(1){
      font-size:1rem;
    }
    &:nth-child(2){
      font-size:2rem;
    }
  }
`;

function MetaEntry({ tag, value, count, score }) {

  return (
    <S.MetaEntry>
      <S.MetaScore>
        <span>{score}</span>
      </S.MetaScore>
      <S.MetaTag>
        <span>{`${tag}: `}</span>
        <span>{value}</span>
      </S.MetaTag>
    </S.MetaEntry>
  );
}

function MetaSubTotal({ extra, label, value }) {
  return (
    <S.MetaEntry>
      <S.MetaScoreSubTotal>
        <span>{extra}</span>
        <span>{value}</span>
      </S.MetaScoreSubTotal>
      <S.MetaRight>
      </S.MetaRight>
    </S.MetaEntry>
  );
}
function MetaTotal({ subTotal, modifier, label, value }) {
  return (
    <S.MetaEntry>
      <S.MetaScoreModifier>
        <div>
          <span>{subTotal}</span>
          <span>{`x${modifier} = `}</span>
        </div>
      </S.MetaScoreModifier>
      <S.MetaScoreTotal>
        <span>{value}</span>
      </S.MetaScoreTotal>
    </S.MetaEntry>
  );
}

function makeLittleCards(cards) {
  const xDelta = 25;
  const degDelta = 10;
  const yDelta = 3;
  const startX = 0 - (cards.length * xDelta) / 2;
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

function StackEntry({ label, idx, count, cards, score, subScore, meta }) {
  return (
    <S.StackEntry stackColor={useMemo(() => StackHelper.getStackColor(idx), [ idx ])} >
      <S.SeLeft>
        <S.InfoCards>
          { makeLittleCards(cards) }
        </S.InfoCards>
      </S.SeLeft>
      <S.SeRight>
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
          <li><hr/></li>
          <li key={'total'}>
            <MetaTotal
              subTotal={subScore}
              modifier={cards.length}
              value={score}
            />
          </li>
        </ul>
      </S.SeRight>
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
      <S.StackHolder>
        { completeStacks.map((stack, idx) => (
          <StackEntry 
            key={idx}
            cards={stack.cardDetails}
            idx={idx}
            label={ StackHelper.getStackLabel(idx) }
            count={stack.count}
            score={stack.score}
            subScore={stack.subScore}
            meta={stack.meta} />
        ))}
      </S.StackHolder>
      <S.Bg>
        <S.BgText src={'./assets/bg/stack-details-text.png'}/>
        <S.BgShape />
      </S.Bg>
    </S.Container>
  );
}

export default StackInfo;
