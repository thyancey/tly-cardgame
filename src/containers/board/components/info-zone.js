import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import MetaHelper from '../../../store/helpers/meta';
import { getColor } from '../../../themes/index';

const S = {};

S.Container = styled.div`
  padding-right:11rem;
  padding-top:10rem;
  font-size:1rem;
`;


S.Bg = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  border: 2rem solid ${getColor('white')};
  background-color:${getColor('blue')};
  border-radius: 50%;
  z-index:-1;

  &:hover{
    box-shadow: 0 0 1rem .2rem ${getColor('white')};
  }
`;


S.ScoreGroup = styled.div`
  text-align:right;
`;

S.TotalScore = styled.div`
  >p{
    &:nth-child(1){
      font-size:2.5rem;
      color:${getColor('white')};
    }

    /* the score  */
    &:nth-child(2){
      font-size: 5rem;
      margin-top: -2.5rem;
      margin-bottom: -1.5rem;
      color:${getColor('ui_blue')};
    }
  }
`;

S.TargetScore = styled.div`
  >p{
    &:nth-child(1){
      font-size:1.5rem;
      color:${getColor('white')};
    }

    /* the score  */
    &:nth-child(2){
      font-size: 3rem;
      margin-top: -1.5rem;
      color:${getColor('ui_orange')};
    }
  }
`;

S.SubScore = styled.div`
  >p{
    /* label */
    &:nth-child(1){
      color:white;
    }
    /* the score  */
    &:nth-child(2){
      font-size: 2rem;
      color:${getColor('blue')};
    }
  }
`;

function InfoZone() {
  const { stacks, hand, roundData } = useContext(StoreContext);
  const completeStacks = useMemo(() => 
    MetaHelper.calcCompleteStacks(stacks, hand),
    [ stacks, hand ]
  );

  const totalScore = useMemo(() => 
    MetaHelper.calcTotalScore(completeStacks), 
    [ completeStacks ]
  );
  
  const ppcScore = useMemo(() => 
    MetaHelper.calcSpcScore(totalScore, hand.length), 
    [ totalScore, hand.length ]
  );

  return (
    <S.Container >
      <S.ScoreGroup>
        <S.TotalScore>
          <p>{'TOTAL'}</p>
          <p>{totalScore}</p>
        </S.TotalScore>
        <S.TargetScore>
          <p>{'TARGET'}</p>
          <p>{roundData.targetScore}</p>
        </S.TargetScore>
      </S.ScoreGroup>
      <S.Bg/>
    </S.Container>
  );
}

export default InfoZone;
