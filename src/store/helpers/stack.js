import ThisModule from './stack';
import { CARDSTATUS } from '../../utils/constants';

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
  // only stack cards in play
  return hand.filter(c => c.status === CARDSTATUS.TABLE).map(c => ({
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

const findStackWithMatch = (stacks, groupPair) => {
  return stacks.findIndex(stack => (stack.indexOf(groupPair[0]) > -1 || stack.indexOf(groupPair[1]) > -1));
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
const mutateForGroupPairs = (stacks, groupPairs) => {
  let matchFound = false;

  // find the next stack
  for(let i = groupPairs.length - 1; i >= 0; i--){
    const foundStackIdx = ThisModule.findStackWithMatch(stacks, groupPairs[i]);
    if(stacks.length === 0){
      stacks.push(groupPairs[i]);
      groupPairs.splice(i, 1);
      matchFound = true;
    } else if(foundStackIdx > -1){
      stacks[foundStackIdx] = ThisModule.mergeArrays(stacks[foundStackIdx], groupPairs[i]);
      groupPairs.splice(i, 1);
      matchFound = true;
    }
  }
  
  if(!matchFound && groupPairs.length > 0){
    stacks.push(groupPairs[groupPairs.length - 1]);
  }

  return {
    stacks: stacks,
    groupPairs: groupPairs
  };
}

const createRawStacks = givenGroupPairs => {
  if(!givenGroupPairs || givenGroupPairs.length === 0) return [];

  let stacks = [];
  let remainingGroupPairs = givenGroupPairs.slice();
  while(remainingGroupPairs.length > 0){
    // find the next stack
    const matchObj = ThisModule.mutateForGroupPairs(stacks, remainingGroupPairs);
    stacks = matchObj.stacks;
    remainingGroupPairs = matchObj.groupPairs;
  }

  return stacks;
}

/* This works, but sure seems like it could be simplified!
  - compares bounds of all cards
  - returns list of "stacks" of unique cardIdxs that are touching
  - there is so much dirty mutation throughout here and probably some big inefficiencies
  ->  [ [ 0, 2, 5], [ 1, 3 ] ]
*/
const calcStacks = (hand) => {
  const boundedHand = ThisModule.createBoundedHand(hand);
  const groupPairs = ThisModule.getGroupPairs(boundedHand);
  const rawStacks = ThisModule.createRawStacks(groupPairs);
  return rawStacks;
};


const getStackColor = (stackIdx) => {
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
};

const ALPHA = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' ]
const getStackLabel = stackIdx => {
  return ALPHA[stackIdx] || '*';
};

export default {
  isThisInThat: isThisInThat,
  mergeArrays: mergeArrays,
  produceBounds: produceBounds,
  createBoundedHand: createBoundedHand,
  doesOverlap: doesOverlap,
  getGroupPairs: getGroupPairs,
  createRawStacks: createRawStacks,
  findStackWithMatch: findStackWithMatch,
  calcStacks: calcStacks,
  mutateForGroupPairs: mutateForGroupPairs,
  getStackColor: getStackColor,
  getStackLabel: getStackLabel,
};
