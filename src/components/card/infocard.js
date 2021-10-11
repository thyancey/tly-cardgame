import React, { useMemo } from 'react';
import styled, { } from 'styled-components';
import {  getColor } from '../../themes/index';
const S = {};

S.Card = styled.div`
  background-color: 'white';
  position:absolute;
`;

S.InnerCard = styled.div`
  position:absolute;
  width:6rem;
  height:9rem;
  transform-origin: 50% 50%;
  left: -3rem;
  top: -4.5rem;
  transition: transform .3s cubic-bezier(1,.05,.32,1.2), opacity .3s;
  border-radius: 1rem;

  box-shadow: -1px -1px 5px 1px ${getColor('grey')};
`;

/* using background-image instead of img made this not request images over and over again? */
S.Background = styled.div`
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 1rem;
  background-image: url(${p => p.src});
`;

function InfoCard({ data }) {
  console.log('data', data)
  return (
    <S.Card>
      <S.InnerCard >
        <S.Background src={data.imageUrl} draggable={false} />
      </S.InnerCard>
    </S.Card>
  );
}

export default InfoCard;
