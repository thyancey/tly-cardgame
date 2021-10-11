import React, { useContext, useMemo, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import StackHelper from '../../../store/helpers/stack';
import MetaHelper from '../../../store/helpers/meta';
import { getColor, mixinFontFamily } from '../../../themes/index';

import InfoCard from '../../../components/card/infocard';

const S = {};

S.Container = styled.div`
  pointer-events:none;
  ${'' /* position:absolute; */}
  ${'' /* right:0; */}
  ${'' /* top:25%; */}
  ${'' /* height:50%; */}
  ${'' /* width:300px; */}
`;


// S.StackEntry = styled.div`
//   position:absolute;
//   right:2rem;
//   bottom:2rem;
  
//   width:40rem;
//   height:20rem;
// `;


// S.Container = styled.div`
//   pointer-events:none;
// `;

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
  right: -2rem;
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

S.NoMeta = styled.li`
  span{

  }
`;

S.MetaLine = styled.li`
  >div{
    display:inline-block;
    vertical-align:top;
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
  font-size:3rem;
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


// S.StackEntry = styled.div`
//   list-style:none;
//   position:relative;
//   border:5px solid white;
// `;

S.StackEntry = styled.div`
  position:absolute;
  padding:20px;
  margin-left: 40px;
  
  opacity:0;
  &.showing{
    opacity:1;
    transition: opacity .5s;
  }

  
`;
S.StackDetailsBg = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  left:0;
  top:0;
  border-left:0;

  border-radius: 10px;
  background-color: ${getColor('blue')};
  border: 10px solid white;
  z-index:-1;
`


S.Cards = styled.div`
  position:absolute;
  right:100%;
  top:50%;
`;

S.Details = styled.div`
  text-align:left;
`;

S.Total = styled.div`
`;

const getStackBounds = (stackIdxs) => {
  let stackBounds = [null, null];

  stackIdxs.forEach(idx => {
    let element = global.document.querySelector(`#card-${idx}`);
    if(element && element.children[0]){
      let eleBox = element.children[0]; //actual card that takes up space
      let rect = eleBox.getBoundingClientRect();
      let upperLeft = { x: rect.left, y: rect.top };
      let lowerRight = { x: rect.right, y: rect.bottom };
      if(!stackBounds[0]){
        stackBounds[0] = upperLeft;
      }else{
        if(upperLeft.x < stackBounds[0].x) stackBounds[0].x = upperLeft.x;
        if(upperLeft.y < stackBounds[0].y) stackBounds[0].y = upperLeft.y;
      }
      if(!stackBounds[1]){
        stackBounds[1] = lowerRight;
      }else{
        if(lowerRight.x > stackBounds[1].x) stackBounds[1].x = lowerRight.x;
        if(lowerRight.y > stackBounds[1].y) stackBounds[1].y = lowerRight.y;
      }
    }
  })

  // console.log('returning stackBounds', stackBounds);
  return stackBounds;
}

const makeLittleCards = cards => {
    const xDelta = 25;
    const degDelta = 10;
    const yDelta = 3;
    const startX = 0 - (cards.length * xDelta);
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
        <S.MetaLineLeft>
          <S.MetaTag>{`${data.tag}`}</S.MetaTag>
          <S.MetaValue>{data.value.toString()}</S.MetaValue>
        </S.MetaLineLeft>
        <S.MetaLineRight>
          <span>{data.score}</span>
        </S.MetaLineRight>
      </S.MetaLine>
    )
  }
  


function StackEntry({ label, idx, count, cards, cardIdxs, score, subScore, meta, isShowing }) {
  let xPos = 0;
  let yPos = 0;
  // console.log('cards', cards)

  let stackBounds = getStackBounds(cardIdxs);
  let cssBox = {};
  if(stackBounds && stackBounds[0]){
    cssBox = {
      // left: stackBounds[0].x,
      // top: stackBounds[0].y,
      // width: stackBounds[1].x - stackBounds[0].x,
      // height: stackBounds[1].y - stackBounds[0].y,
      left: stackBounds[1].x,
      top: stackBounds[0].y,
      // height: stackBounds[1].y - stackBounds[0].y,
    }
  }

  return (
    <S.StackEntry 
      style={ cssBox }
      className={ isShowing ? 'showing' : 'hidden' } >
      {/* <S.Cards>
        { makeLittleCards(cards) }
      </S.Cards> */}
      <S.Details>
        {meta.length > 0 ? (
          <S.StackMeta>
            {meta.map((m, i) => <MetaLine key={i} data={m} />)}
          </S.StackMeta>
        ):(
          <S.StackMeta>
            <S.NoMeta><span>{'no matching tags'}</span></S.NoMeta>
          </S.StackMeta>
        )}
      </S.Details>
      <S.Total>
        <span>{count}</span>
        <span>{` cards x `}</span>
        <S.SubScoreValue>{subScore}</S.SubScoreValue>

        <span>{'= '}</span>
        <span>{score}</span>
      </S.Total>
      <S.StackDetailsBg />
    </S.StackEntry>
  );
}

// function StackConsole() {
//   const { stacks, hand } = useContext(StoreContext);
//   const completeStacks = useMemo(() => 
//     MetaHelper.calcCompleteStacks(stacks, hand),
//     [ stacks, hand ]
//   );

//   console.log('completStacks is ', completeStacks)
  

//   return (
//     <S.Container id="stack-data-container">
//       {completeStacks.map((stack,idx) => (
//         <StackEntry 
//             key={`stack-${idx}`}
//             cards={stack.cardDetails}
//             cardIdxs={stack.cardIdxs}
//             idx={stack.idx}
//             label={ StackHelper.getStackLabel(stack.idx) }
//             count={stack.count}
//             score={stack.score}
//             subScore={stack.subScore}
//             meta={stack.meta} />
//       ))}
//     </S.Container>
//   );
// }

var timer;

function StackConsole() {
  const { stacks, hand, focusedStackIdx } = useContext(StoreContext);
  const [ isShowing, setIsShowing ] = useState(false);

  const completeStacks = useMemo(() => 
    MetaHelper.calcCompleteStacks(stacks, hand),
    [ stacks, hand ]
  );

  const stack = useMemo(() => 
    completeStacks.find(stack => stack.idx === focusedStackIdx),
    [ completeStacks, focusedStackIdx ]
  );


  /* whatever im doing here is bullshit, redo this tooltip type thing */
  function startTimeout(callback){
    killTimer();
    timer = window.setTimeout(callback, 1);
  }

  function killTimer(){
    if(timer){
      window.clearTimeout(timer);
      timer = null;
    }
  }

  useEffect(() => {
    if(stack){
      if(focusedStackIdx !== stack.idx){
        setIsShowing(false);
      }else{
        if(!isShowing){
          startTimeout(() => {
            setIsShowing(true);
          })
        }
      }
    }else{
      setIsShowing(false);
    }
  },
  [ stack, isShowing, focusedStackIdx, setIsShowing ]);

  return (
    <S.Container id="stack-data-container" >
      {stack && (
        <StackEntry 
          isShowing={isShowing}
          cards={stack.cardDetails}
          cardIdxs={stack.cardIdxs}
          idx={stack.idx}
          label={ StackHelper.getStackLabel(stack.idx) }
          count={stack.count}
          score={stack.score}
          subScore={stack.subScore}
          meta={stack.meta} />
      )}
    </S.Container>
  );
}


export default StackConsole;
