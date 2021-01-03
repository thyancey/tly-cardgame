import DeckMaker from './deckmaker';


describe('store.helpers.deckmaker', () => {
  describe('#filterDeckToWhatsLeft', () => {
    const deck = [
      {
        testId: 'deck0',
        deckIdx: 0
      },
      {
        testId: 'deck1',
        deckIdx: 1
      },
      {
        testId: 'deck2',
        deckIdx: 2
      },
      {
        testId: 'deck3',
        deckIdx: 3
      }
    ];

    it('should reduce deck to available cards', () => {
      const activeCards =  [
        {
          cardIdx: 0,
          deckIdx: 0,
        },{
          cardIdx: 2,
          deckIdx: 2,
        },
      ];

      const expected = [
        {
          testId: 'deck1',
          deckIdx: 1
        },
        {
          testId: 'deck3',
          deckIdx: 3
        }
      ];

      expect(DeckMaker.filterDeckToWhatsLeft(activeCards, deck, [])).toEqual(expected);
    });
    
    it('should reduce deck to available cards (with workorder)', () => {
      const activeCards =  [
        {
          cardIdx: 0,
          deckIdx: 0,
        },{
          cardIdx: 2,
          deckIdx: 2,
        },
      ];
      const workOrder = [ 1 ];

      const expected = [
        {
          testId: 'deck3',
          deckIdx: 3
        }
      ];

      expect(DeckMaker.filterDeckToWhatsLeft(activeCards, deck, workOrder)).toEqual(expected);
    });

    
    it('shouldnt reduce deck if no matching cards or workorder', () => {
      const activeCards =  [
        {
          cardIdx: 0,
          deckIdx: 0,
        },{
          cardIdx: 9,
          deckIdx: 9,
        },
      ];
      const workOrder = [ 8 ];

      const expected = [
        {
          testId: 'deck1',
          deckIdx: 1
        },
        {
          testId: 'deck2',
          deckIdx: 2
        },
        {
          testId: 'deck3',
          deckIdx: 3
        }
      ];

      expect(DeckMaker.filterDeckToWhatsLeft(activeCards, deck, workOrder)).toEqual(expected);
    });
  });

  describe('#produceHand', () => {
    let orig = {};
    beforeEach(() => {
      orig.produceCard = DeckMaker.produceCard;
    });
    
    afterEach(() => {
      DeckMaker.produceCard = orig.produceCard;
    });

    const deck = [
      {
        testId: 'deck0',
        deckIdx: 0
      },
      {
        testId: 'deck1',
        deckIdx: 1
      }
    ];


    it('should produce a single card for a clean hand', () => {
      DeckMaker.produceCard = jest.fn((idx) => `newCard${idx}`);

      expect(DeckMaker.produceHand(1, deck, [], 1)).toEqual([
        'newCard0'
      ]);
    });
    
    it('should produce two cards for a clean hand', () => {
      DeckMaker.produceCard = jest.fn((idx) => `newCard${idx}`);

      expect(DeckMaker.produceHand(2, deck, [], 1)).toEqual([
        'newCard0',
        'newCard1'
      ]);
    });

    it('should produce 0 cards when requested', () => {
      DeckMaker.produceCard = jest.fn((idx) => `newCard${idx}`);

      expect(DeckMaker.produceHand(0, deck, [], 1)).toEqual([]);
    });

    it('should produce 0 cards if produceCard returns null', () => {
      DeckMaker.produceCard = jest.fn((idx) => null);

      expect(DeckMaker.produceHand(1, deck, [], 1)).toEqual([]);
    });

    it('should call produceHand based off of hand length', () => {
      DeckMaker.produceCard = jest.fn();

      DeckMaker.produceHand(2, deck, [ 'card1', 'card2' ], 1);

      expect(DeckMaker.produceCard.mock.calls[0][0]).toEqual(2);
      expect(DeckMaker.produceCard.mock.calls[1][0]).toEqual(3);
    });

    it('should call produceHand based off 0 if no hand given', () => {
      DeckMaker.produceCard = jest.fn();

      DeckMaker.produceHand(2, deck, [], 1);

      expect(DeckMaker.produceCard.mock.calls[0][0]).toEqual(0);
      expect(DeckMaker.produceCard.mock.calls[1][0]).toEqual(1);
    });
  });
});