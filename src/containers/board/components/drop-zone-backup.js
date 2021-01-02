import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
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

/* 
  TODO, im obviously doing something wrong here with useEffect and refs, need to figure out how to
  get this value to update when the dom element repositions on screen, without causing an infinite re-render loop

  maybe make this one hookless
*/
function DropZone() {
  const { newSetZone } = useContext(StoreContext);
  const zoneRef = useRef(null);

  const [ windowSize, setWindowSize ] = useState({
    width:0,
    height:0
  });

  const zoneLeft = zoneRef?.current?.getBoundingClientRect()?.left || 0;
  const zoneTop = zoneRef?.current?.getBoundingClientRect()?.top || 0;
  const zoneRight = zoneRef?.current?.getBoundingClientRect()?.right || 0;
  const zoneBottom = zoneRef?.current?.getBoundingClientRect()?.bottom || 0;

  //https://usehooks.com/useWindowSize/
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [ setWindowSize, zoneTop, zoneLeft, zoneRight, zoneBottom ]);

  useEffect(() => {
    newSetZone('discard', zoneTop, zoneRight, zoneBottom, zoneLeft );
  }, [ zoneTop, zoneLeft, zoneRight, zoneBottom ]);


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
