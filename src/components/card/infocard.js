import React, {} from 'react';
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

S.Background = styled.img`
  background-size: contain;
  width:100%;
  border-radius:1rem;
`;


function InfoCard({ data }) {

  return (
    <S.Card>
      <S.InnerCard >
        <S.Background src={data.imageUrl} draggable={false} />
      </S.InnerCard>
    </S.Card>
  );
}

export default InfoCard;
