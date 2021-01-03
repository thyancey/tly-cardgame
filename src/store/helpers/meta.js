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
    .filter(sM => sM.count === cardIdxs.length); //- if meta doesnt match all, remove it (TODO, bonus cards later)
}

const getSortedCardDetails = (cardStack, hand) => 
  cardStack.map(cIdx => {
    const cdata = hand.find(c => c.cardIdx === cIdx);
    return {
      ...cdata.info,
      layer: cdata.layer
    }
  }).sort((a,b) => (a.layer > b.layer) ? 1 : -1);

/* external */
const calcCompleteStacks = (stacks, hand) => stacks.map((s, sIdx) => {
  const stackMeta = calcStackMeta(s, hand);

  return {
    idx: sIdx,
    cardIdxs: s,
    cardDetails: getSortedCardDetails(s, hand),
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
