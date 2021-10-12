export const CARDSTATUS = {
  'DECK':0,
  'HAND':1,
  'HAND_HOLDING':2,
  'TABLE':3,
  'TABLE_HOLDING':4,
  'DISCARDED':5
}

export const getCardStatusLabel = statusIdx => {
  return Object.keys(CARDSTATUS).find(statusKey => CARDSTATUS[statusKey] === statusIdx) || 'NULL';
}

export default {};