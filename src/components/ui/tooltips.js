import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import {  getColor } from '../../themes/index';
import { StoreContext } from '../../store/context';
import MetaHelper from '../../store/helpers/meta';
import StackHelper from '../../store/helpers/stack';

const S = {};

S.Tooltips = styled.div`
  position:fixed;
  pointer-events:none;
  top:0;
  left:0;
  z-index:3;
`;

S.Tooltip = styled.div`
  position:absolute;
  transition: top .2s, left: .2s;
`;

S.StackEntry = styled.div`
  opacity:0;
  font-size:1.5rem;

  ${p => p.isActive && css`
    opacity:1;
  `}

  background-color:black;
  border:5px solid white;
  border-radius:2rem;
  padding:.5rem 1rem;
  padding-top:0;
  min-width: 20rem;

  ul{
    list-style:none;
	  margin-left: 0;
	  padding-left: 0;
  }
`;

S.MetaLine = styled.li`
  color:white;
  display:flex;
`;
S.MetaTag = styled.div`
  border:2px solid white;
  background-color: ${getColor('blue')};
  border-radius:1rem;
  padding:1rem;
`;
S.MetaScore = styled.div`
  flex: 1 0 20%;
  text-align:right;
`;
S.MetaTagLabel = styled.p`

`;
S.MetaTagValue = styled.p`
  font-size:1.25rem;
`;
S.StackTotal = styled.div`
  color:white;
`;


function MetaLine({ data }){
  return (
    <S.MetaLine>
      <S.MetaTag>
        <S.MetaTagLabel>{`${data.tag}:`}</S.MetaTagLabel>
        <S.MetaTagValue>{`${data.value.toString()}`}</S.MetaTagValue>
      </S.MetaTag>
      <S.MetaScore>
        <p>{data.score}</p>
      </S.MetaScore>
    </S.MetaLine>
  );
}

function StackEntry({ stack }) {
  if(stack){
    return (
      <S.StackEntry isActive={!!stack}>
        {stack.meta.length > 0 ? (
          <ul>
            { stack.meta.map((m, i) => <MetaLine key={i} data={m} />) }
          </ul>
        ):(
          <ul>
            <li>{'no matching tags'}</li>
          </ul>
        )}
        <S.StackTotal>
          <span>{stack.count}</span>
          <span>{` cards x `}</span>
          <span>{stack.subScore}</span>
          <span>{'= '}</span>
          <span>{stack.score}</span>
        </S.StackTotal>
      </S.StackEntry>
    )
  } else{
    return (
      <S.StackEntry isActive={false}>
      </S.StackEntry>
    );
  }
}


function Tooltips({ data }) {
  const { mouseCoords, stacks, hand, focusedStackIdx } = useContext(StoreContext);

  const tooltipCss = useMemo(() => {
    if(mouseCoords){
      return {
        left: mouseCoords.x,
        top: mouseCoords.y
      }
    }else{
      return null;
    }
  }, [ mouseCoords ]);

  const completeStacks = useMemo(() => 
    MetaHelper.calcCompleteStacks(stacks, hand),
    [ stacks, hand ]
  );
  const stack = useMemo(() => 
    completeStacks.find(stack => stack.idx === focusedStackIdx),
    [ completeStacks, focusedStackIdx ]
  );

  return (
    <S.Tooltips>
      <S.Tooltip style={tooltipCss} isActive={!!stack}>
        <StackEntry stack={stack} />
      </S.Tooltip>
    </S.Tooltips>
  );
}

export default Tooltips;
