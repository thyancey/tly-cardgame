import ThisModule from './stack';

const BOUND_OFFSET = {
  W: 50,
  H: 75
};

const isThisInThat = (aA, aB) => {
  if(!aA || !aB) return false;
  let foundIdx = aA.findIndex(a => aB.indexOf(a) > -1);
  return foundIdx > -1;
};

const mergeArrays = (aA, aB) => {
  aA = aA || [];
  aB = aB || [];
  return aA.concat(aB.filter((b) => aA.indexOf(b) < 0));
};

const produceBounds = position => {
  return {
    left: position.x - BOUND_OFFSET.W,
    top: position.y - BOUND_OFFSET.H,
    right: position.x + BOUND_OFFSET.W,
    bottom: position.y + BOUND_OFFSET.H
  }
};

// cards only start with position, calc the bounds once please
const createBoundedHand = hand => {
  return hand.map(c => ({
    cardIdx: c.cardIdx,
    bounds: ThisModule.produceBounds(c.position)
  }));
};

const doesOverlap = (bA, bB) => {
  return bA.top <= bB.bottom && bA.bottom >= bB.top && bA.left <= bB.right && bA.right >= bB.left;
};

// do some weird loopin to avoid checking the same pair twice
const getGroupPairs = boundedHand => {
  const groupPairs = [];

  // do some weird loopin to avoid checking the same pair twice
  for(let a = 0; a < boundedHand.length; a++){
    for(let b = a + 1; b < boundedHand.length; b++){
      if(ThisModule.doesOverlap(boundedHand[a].bounds, boundedHand[b].bounds)){
        groupPairs.push([boundedHand[a].cardIdx, boundedHand[b].cardIdx]);
      }
    }
  }

  return groupPairs;
}

/*
  //- now have a list of..
    [0, 1]
    [1, 2]
    [4, 5]

  // so convert to
    [0, 1, 2]
    [4, 5]
*/
const createFinalGroups = groupPairs => {
  let finalGroups = [];

  groupPairs.forEach(gP => {
    finalGroups = ThisModule.collapseGroups(finalGroups.slice());
    let foundIdx = finalGroups.findIndex(fg => (fg.indexOf(gP[0]) > -1 || fg.indexOf(gP[1]) > -1));
    if(foundIdx > -1){
      gP.forEach(gPC => {
        if(finalGroups[foundIdx].indexOf(gPC) === -1){
          finalGroups[foundIdx] = finalGroups[foundIdx].concat(gPC);
        }
      })
    }else{
      finalGroups.push(gP);
    }
  })

  return finalGroups;
}

/* this is too complicated, gotta be a better way
  input
    [ 0, 1, 2]
    [ 5, 6 ]
    [ 7, 8 ]
    [ 1, 5]

  output
    [ 0, 1, 2, 5, 6 ]
    [ 7, 8 ]
*/
const collapseGroups = groups => {
  // console.log('--------- collapsing groups:', groups)
  let collapsed = [];
  for(let g = groups.length - 1; g >= 0; g--){
    if(collapsed.length === 0){
      collapsed.push(groups[g]);
      groups.pop();
    }else{
      for(let c = 0; c < collapsed.length; c++){
        if(ThisModule.isThisInThat(collapsed[c], groups[g])){
          collapsed[c] = ThisModule.mergeArrays(collapsed[c], groups[g]);
          groups.pop();
          break;
        }else{
          collapsed.push(groups.pop());
          break;
        }
  
      }
    }
  }

  return collapsed;
};


/* This works, but sure seems like it could be simplified!
  - compares bounds of all cards
  - returns list of "stacks" of unique cardIdxs that are touching
  - there is so much dirty mutation throughout here and probably some big inefficiencies
  ->  [ [ 0, 2, 5], [ 1, 3 ] ]
*/
const calcStacks = (hand) => {
  const boundedHand = ThisModule.createBoundedHand(hand);
  const groupPairs = ThisModule.getGroupPairs(boundedHand);
  const finalGroups = ThisModule.createFinalGroups(groupPairs);
  return finalGroups;
};

export default {
  isThisInThat: isThisInThat,
  mergeArrays: mergeArrays,
  produceBounds: produceBounds,
  createBoundedHand: createBoundedHand,
  doesOverlap: doesOverlap,
  getGroupPairs: getGroupPairs,
  createFinalGroups: createFinalGroups,
  collapseGroups: collapseGroups,
  calcStacks: calcStacks,
};
