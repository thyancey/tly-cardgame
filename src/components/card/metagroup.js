import React, {} from 'react';
import styled, { css } from 'styled-components';
import {  getColor } from '../../themes/index';

const S = {};

S.MetaGroup = styled.ul`
  position: absolute;
  left: 100%;
  top: 0;
  text-align: left;
  margin:0;
  padding: 0;
  padding-left:.5rem;

  list-style:none;
  font-size:.7rem;
  color: ${getColor('white')};
`;

S.MetaEntry = styled.li`
  white-space: nowrap;

  >span:first-child{
    color: ${getColor('yellow')};
  }
`;

function MetaGroup({ data }) {
  return (
    <S.MetaGroup>
      {data.map(m => (
        <S.MetaEntry key={`${m.tag}-${m.value}`}>
          <span>{`${m.tag}: `}</span> 
          <span>{m.value}</span>
        </S.MetaEntry>
      ))}
    </S.MetaGroup>
  );
}

export default MetaGroup;
