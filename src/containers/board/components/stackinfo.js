import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import { getColor } from '../../../themes/index';

const S = {};

S.Container = styled.div`
  padding:1rem;

  color:white;
  border: 2px solid white;
  font-size:1rem;
  text-align:left;
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

S.Header = styled.div`
  min-height: 3rem;
`;

S.Summary = styled.div`

`;

S.TotalScore = styled.div`
  position:absolute;
  top:.5rem;
  right:1rem;

  >span{
    display:inline-block;
    vertical-align:top;
    /* total score: */
    &:nth-child(1){
      margin: .5rem;
      color:white;
    }
    /* the score  */
    &:nth-child(2){
      font-size: 3rem;
      color:${getColor('yellow')};
    }
  }
`;

S.SubScore = styled.div`
  /* position:absolute; */
  top:.5rem;
  right:1rem;

  >span{
    display:inline-block;
    vertical-align:top;
    /* the score  */
    &:nth-child(1){
      font-size: 2rem;
      color:${getColor('blue')};
    }
    /* total score: */
    &:nth-child(2){
      margin: .5rem;
      color:white;
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

const newMetaGroup = metaInfo => ({
  tag: metaInfo.tag,
  value: metaInfo.value,
  score: metaInfo.score,
  count: 1
});

const mergeMetaGroup = (oldMeta, newMeta) => ({
  ...oldMeta,
  count: oldMeta.count + 1
});

const produceCards = (cardIdxs, hand) => cardIdxs.map((cardIdx) => hand.find(h => h.cardIdx === cardIdx));

const calcStackMeta = ( cardIdxs, hand ) => {
  const cards = produceCards(cardIdxs, hand);

  let stackMeta = [];
  let invalidatedTags = [];
  cards.forEach(c => {
    c.info.meta.forEach(cMeta => {
      const foundIdx = stackMeta.findIndex(m => m.tag === cMeta.tag);
      if(foundIdx > -1){
        /* for now, tag/value combos must match for card to aggregate..
           if "color":"red", dont wanna aggregate any new meta where "color":"blue", etc
        */
        if(stackMeta[foundIdx].value === cMeta.value){
          stackMeta[foundIdx] = mergeMetaGroup(stackMeta[foundIdx], cMeta);
        }else{
          //- tag/value combo doesnt match for this card
          //- maybe later, invalidate tag group
          if(invalidatedTags.indexOf(cMeta.tag) === -1) invalidatedTags.push(cMeta.tag);
        }
      }else{
        stackMeta.push(newMetaGroup(cMeta));
      }
    })
  });

  return stackMeta
    .filter(sM => !foundInTags(sM.tag, invalidatedTags)) //- remove any invalid groups
    .filter(sM => sM.count > 1); //- remove any single counts (TODO, bonus cards later)
}

const foundInTags = (checkTag, tags) => tags.some(t => t === checkTag);

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


function StackEntry({ idx, count, score, meta }) {

  return (
    <S.StackEntry stackColor={useMemo(() => StackHelper.getStackColor(idx), [ idx ])} >
      <h4>{`stack #${idx}`}</h4>
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

  const completeStacks = useMemo(() => {
    return stacks.map((s, sIdx) => {
      const stackMeta = calcStackMeta(s, hand);
      return {
        idx: sIdx,
        cardIdxs: s,
        count: s.length,
        meta: stackMeta,
        score: stackMeta.reduce(((totalScore, meta) => totalScore + (meta.count * meta.score)), 0)
      }
    });
  }, [ stacks, hand ]);

  const totalScore = useMemo(() => {
    return completeStacks.reduce(((totalScore, curStack) => curStack.score + totalScore), 0);
  }, [ completeStacks ]);
  
  const ppcScore = useMemo(() => {
    return (hand.length > 0 && totalScore / hand.length) || 0;
  }, [ totalScore, hand.length ]);

  console.log('completeStacks', completeStacks)

  return (
    <S.Container >
      <S.Header>
        <p>{'Stack Info'}</p>
        <S.TotalScore>
          <span>{'Total score: '}</span>
          <span>{totalScore}</span>
        </S.TotalScore>
        <S.SubScore>
          <span>{hand.length}</span>
          <span>{'cards in play'}</span>
        </S.SubScore>
        <S.SubScore>
          <span>{ppcScore}</span>
          <span>{'score/card'}</span>
        </S.SubScore>
      </S.Header>
      <S.Summary>
        { completeStacks.map((stack, idx) => (
          <StackEntry 
            key={idx}
            idx={idx}
            count={stack.count}
            score={stack.score}
            meta={stack.meta} />
        ))}
      </S.Summary>
    </S.Container>
  );
}

export default StackInfo;
