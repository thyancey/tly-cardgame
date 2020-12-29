import React, { useContext } from 'react';
import styled, {} from 'styled-components';
import { StoreContext } from '../../../store/context';

const S = {};

S.Container = styled.div`
  padding:1rem;

  color:white;
  border: 2px solid white;
  font-size:1rem;
  text-align:left;
`;

S.DebugBlock = styled.div`
  ul{
    list-style:none;
    padding-left:1rem;
    margin:0;
  }
`;
function DebugBlock({ label, output }) {

  return (

    <S.DebugBlock>
      { label && (<h4>{label}</h4>)}
      <ul>
        { output.map((op, idx) => (
          <li key={idx}>{`${op[0]}: ${op[1]}`}</li>
        )) }
      </ul>
    </S.DebugBlock>
  );
}

function Debug() {
  const { stacks } = useContext(StoreContext);

  return (
    <S.Container >
      <p>{'debug'}</p>
      { stacks.map((d, idx) => (
        <DebugBlock 
          key={idx}
          label={`size: ${d.length}`}
          output={[
            ['', d.join(',')]
          ]} />
      ))}
    </S.Container>
  );
}

export default Debug;
