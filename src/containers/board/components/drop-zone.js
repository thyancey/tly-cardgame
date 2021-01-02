import React from 'react';
import styled, { } from 'styled-components';
import { StoreContext } from '../../../store/context';
import { getColor } from '../../../themes';

const S = {};

S.Container = styled.div`
  width: 100%;
  height: 100%;
  border: 2rem solid ${getColor('white')};
  background-color:${getColor('purple')};
  border-radius: 50%;

  &:hover{
    box-shadow: 0 0 1rem .2rem white;
  }
`;

S.ZoneText = styled.p`
  margin-top:40%;
  font-size:3rem;
  color: white;
`;

S.BasicButton = styled.button`
  padding: .5rem 1.5rem;
  font-size: 1rem;
`;

S.Zone = styled.div`
`;

/* 
  TODO, tried this with hooks but couldnt get it to stop doing an infinite re-render with refs and useEffect
*/
class DropZone extends React.Component{
  static contextType = StoreContext;

  constructor(props) {
    super(props)
    this.zoneRef = React.createRef();
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize(){
    this.context.setZone('discard', this.zoneRef?.current?.getBoundingClientRect());
  }

  render() {
    return (
      <S.Container 
        ref={this.zoneRef} >
        <S.Zone >

        </S.Zone>
        <S.ZoneText>{'DISCARD'}</S.ZoneText>
      </S.Container>
    )
  };
}

export default DropZone;
