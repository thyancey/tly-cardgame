import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { } from 'styled-components';
import { StoreContext } from '../../../store/context';

const S = {};

S.Container = styled.div`
  width:100%; 
  height:100%;
  padding:1rem;

  color:white;
  border: 2px solid white;

  &:hover{
    color:yellow;
    border-color:yellow;
    border: 4px solid yellow;
    box-shadow: 0 0 1rem .2rem yellow;
  }
`;

S.BasicButton = styled.button`
  padding: .5rem 1.5rem;
  font-size: 1rem;
`;

S.Zone = styled.div`
`;


function DropZone() {
  const { setZone } = useContext(StoreContext);
  const zoneRef = useRef(null);
  // let registeredZone = false;

  const [ state, setState ] = useState({
    registeredZone: null
  });

  useEffect(() => {
    if(!state.registeredZone){
      // console.log(zoneRef.current.getBoundingClientRect());
      setZone('discard', zoneRef.current.getBoundingClientRect());
      setState({registeredZone: true});
    }
  }, [ setZone, zoneRef, state.registeredZone ]);


  return (
    <S.Container 
    ref={zoneRef} >
      <S.Zone >

      </S.Zone>
      {'discard zone'}
    </S.Container>
  );
}

export default DropZone;
