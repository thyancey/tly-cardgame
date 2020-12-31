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

S.MetaEntry = styled.div`
  border: 2px solid white;
  border-radius: 1rem;
  padding:.5rem;
`;

/*
  [
    {
      tag: "suit",
      count: 3,
      score: 3000
    }
  ]

*/

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
      <div>
        <p>{`${tag}: ${value}`}</p>
        <p>{`${count} x ${score} = ${count * score}`}</p>
      </div>
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

  console.log('completeStacks', completeStacks)

  return (
    <S.Container >
      <p>{'Stack Info'}</p>
      <p>{`Total score:${totalScore}`}</p>
      { completeStacks.map((stack, idx) => (
        <StackEntry 
          key={idx}
          idx={idx}
          count={stack.count}
          score={stack.score}
          meta={stack.meta} />
      ))}
    </S.Container>
  );
}

export default StackInfo;
