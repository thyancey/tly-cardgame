import React from 'react';

export const InitialState = {
  holdingIdx: 0,
  deck: [],
  hand: []
};

export const StoreContext = React.createContext(InitialState);