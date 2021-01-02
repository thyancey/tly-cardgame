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
const foundInTags = (checkTag, tags) => tags.some(t => t === checkTag);

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

/* external */
const calcCompleteStacks = (stacks, hand) => stacks.map((s, sIdx) => {
  const stackMeta = calcStackMeta(s, hand);

  return {
    idx: sIdx,
    cardIdxs: s,
    cardDetails: s.map(cIdx => hand.find(c => c.cardIdx === cIdx).info),
    count: s.length,
    meta: stackMeta,
    subScore: stackMeta.reduce(((totalScore, meta) => totalScore + meta.score), 0),
    score: stackMeta.reduce(((totalScore, meta) => totalScore + (meta.count * meta.score)), 0)
  }
});
const calcTotalScore = completeStacks => completeStacks.reduce(((totalScore, curStack) => curStack.score + totalScore), 0);
const calcSpcScore = (totalScore, handLength) => (handLength > 0 && Math.round(totalScore / handLength)) || 0;

export default {
  calcTotalScore: calcTotalScore,
  calcSpcScore: calcSpcScore,
  calcCompleteStacks: calcCompleteStacks,
};
