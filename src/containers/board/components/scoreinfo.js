import React, { useContext, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { StoreContext } from '../../../store/context';
import MetaHelper from '../../../store/helpers/meta';
import { getColor } from '../../../themes/index';

const S = {};

S.Container = styled.div`
  padding:1rem;

  color:white;
  border: 2px solid white;
  font-size:1rem;
`;

S.ScoreGroup = styled.div`
  text-align:right;
  >div{
    margin-top:.5rem;
    &:first-child{
      margin-top:0;
    }
  }
`;

S.TotalScore = styled.div`
  >p{
    &:nth-child(1){
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

function StackInfo() {
  const { stacks, hand } = useContext(StoreContext);
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
          <p>{'Total score'}</p>
          <p>{totalScore}</p>
        </S.TotalScore>
        <hr/>
        <S.SubScore>
          <p>{'cards in play'}</p>
          <p>{hand.length}</p>
        </S.SubScore>
        <S.SubScore>
          <p>{'score/card'}</p>
          <p>{ppcScore}</p>
        </S.SubScore>
      </S.ScoreGroup>
    </S.Container>
  );
}

export default StackInfo;
