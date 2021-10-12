import React from 'react';
import styled, { } from 'styled-components';
import { StoreContext } from '../../../store/context';

const S = {};

S.Container = styled.div`
  width: 100%;
  height: 100%;
  p{
    opacity:0;
    color: white;
    transition: opacity .1s;
    text-align:left;
    margin-left:1rem;
  }
  transition: box-shadow 1s;

  &:hover{
    box-shadow: 0 0 1rem .2rem white;
    transition-delay: .5s;
    p{
      opacity:1;
      transition: opacity 1s;
      transition-delay: .7s;
    }
  }
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
    this.context.actions.setZone('hand', this.zoneRef?.current?.getBoundingClientRect());
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize(){
    this.context.actions.setZone('hand', this.zoneRef?.current?.getBoundingClientRect());
  }

  render() {
    return (
      <S.Container 
        ref={this.zoneRef} >
        <p>{'Return card to hand'}</p>
      </S.Container>
    )
  };
}

export default DropZone;
