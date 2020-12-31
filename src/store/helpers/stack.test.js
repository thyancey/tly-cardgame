import StackHelper from './stack';


describe('store.helpers.stack', () => {
  describe('#isThisInThat', () => {
    it('should match arrays with single shared value', () => {
      const arrays =  [
        [ '1', '2', '3' ],
        [ '3', '4', '5' ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(true);
    });
    it('should match arrays with multiple shared values', () => {
      const arrays =  [
        [ '1', '2', '3' ],
        [ '1', '2', '3' ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(true);
    });
    it('should match arrays with shared 0 numbers', () => {
      const arrays =  [
        [ 1, 0 ],
        [ 0, 1 ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(true);
    });
    it('should match arrays with diff value counts', () => {
      const arrays =  [
        [ '1' ],
        [ '3', '1', '5' ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(true);
      
      const arrays2 =  [
        [ '3', '1', '5' ],
        [ '1' ]
      ]
      expect(StackHelper.isThisInThat(arrays2[0], arrays2[1])).toBe(true);
    });
    it('should not match with mismatched strings', () => {
      const arrays =  [
        [ '1', '2', '3' ],
        [ '4', '5', '6' ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(false);
    });
    it('should not match with mismatched values', () => {
      const arrays =  [
        [ 1, 0 ],
        [ 2 ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(false);
    });
    it('should not match different types', () => {
      const arrays =  [
        [ 1 ],
        [ '1' ]
      ]
      expect(StackHelper.isThisInThat(arrays[0], arrays[1])).toBe(false);
    });
    it('should not match with null arrays', () => {
      expect(StackHelper.isThisInThat([ '1' ], null)).toBe(false);
      expect(StackHelper.isThisInThat(null, [ '1' ])).toBe(false);
    });
  });
  
  describe('#mergeArrays', () => {
    it('should merge arrays of numbers', () => {
      const arrays =  [
        [ 1, 0 ],
        [ 2 ]
      ];
      const result = [ 1, 0, 2 ];

      expect(StackHelper.mergeArrays(arrays[0], arrays[1])).toEqual(result);
    });

    it('should merge arrays of numbers, ignoring redundant values', () => {
      const arrays =  [
        [ 1, 2, 0 ],
        [ 2, 1, 3 ]
      ];
      const result = [ 1, 2, 0, 3 ];

      expect(StackHelper.mergeArrays(arrays[0], arrays[1])).toEqual(result);
    });

    it('should merge arrays of strings', () => {
      const arrays =  [
        [ '1', '0' ],
        [ '2' ]
      ];
      const result = [ '1', '0', '2' ];

      expect(StackHelper.mergeArrays(arrays[0], arrays[1])).toEqual(result);
    });

    it('should merge arrays of strings, ignoring redundant values', () => {
      const arrays =  [
        [ '1', '2', '0' ],
        [ '2', '1', '3' ]
      ];
      const result = [ '1', '2', '0', '3' ];

      expect(StackHelper.mergeArrays(arrays[0], arrays[1])).toEqual(result);
    });

    it('should handle null arrays ok', () => {
      expect(StackHelper.mergeArrays([ '1', '2', '3' ], null)).toEqual([ '1', '2', '3' ]);
      expect(StackHelper.mergeArrays(null, [ '1', '2', '3' ])).toEqual([ '1', '2', '3' ]);
      expect(StackHelper.mergeArrays(null, null)).toEqual([]);
    });
  });

  describe.skip('#produceBounds', () => {
    it('simple enough to skip for now', () => {
      expect(true).toBe(false);
    });
  });
  describe.skip('#createBoundedHand', () => {
    it('simple enough to skip for now', () => {
      expect(true).toBe(false);
    });
  });
  describe.skip('#doesOverlap', () => {
    it('simple enough to skip for now', () => {
      expect(true).toBe(false);
    });
  });

  describe('#findStackWithMatch', () => {
    it('should find normal match', () => {
      const stacks = [
        [0, 1, 2],
        [3, 4]
      ];
      const groupPair = [ 2, 5 ];

      expect(StackHelper.findStackWithMatch(stacks, groupPair)).toEqual(0);
    });

    it('should find another match', () => {
      const stacks = [
        [0, 1, 2],
        [3, 4]
      ];
      const groupPair = [ 3, 5 ];

      expect(StackHelper.findStackWithMatch(stacks, groupPair)).toEqual(1);
    });

    it('should find first match', () => {
      const stacks = [
        [0, 1, 2],
        [3, 4]
      ];
      const groupPair = [ 3, 1 ];

      expect(StackHelper.findStackWithMatch(stacks, groupPair)).toEqual(0);
    });

    it('should not find normal mismatch', () => {
      const stacks = [
        [0, 1, 2],
        [3, 4]
      ];
      const groupPair = [ 5, 6 ];

      expect(StackHelper.findStackWithMatch(stacks, groupPair)).toEqual(-1);
    });
  });
  
  describe('#createRawStacks', () => {
    it('should simplifiy groupPairs into unique stacks', () => {
      const groupPairs = [
        [0, 1],
        [1, 2],
        [3, 1],
        [4, 5],
        [5, 6],
        [7, 3]
      ];
      const result = [
        [7, 3, 1, 2, 0],
        [5, 6, 4]
      ];

      expect(StackHelper.createRawStacks(groupPairs)).toEqual(result);
    });

    it('should simplifiy groupPairs (with unexpected redundancy?) into unique stacks', () => {
      const groupPairs = [
        [0, 1],
        [0, 1],
        [1, 2],
        [3, 1],
        [4, 5],
        [5, 6],
        [7, 1],
        [7, 3]
      ];
      const result = [
        [7, 3, 1, 2, 0],
        [5, 6, 4]
      ];

      expect(StackHelper.createRawStacks(groupPairs)).toEqual(result);
    });

    it('should handle simple 2 item stacks', () => {
      const groupPairs = [
        [0, 1],
        [1, 2],
        [7, 2],
        [11, 12]
      ];
      const result = [
        [11, 12],
        [7, 2, 1, 0]
      ];

      expect(StackHelper.createRawStacks(groupPairs)).toEqual(result);
    });

    it('should be OK with no groupPairs', () => {
      expect(StackHelper.createRawStacks([])).toEqual([]);
      expect(StackHelper.createRawStacks(null)).toEqual([]);
    });
  });
  
  /* 2big2test */
  describe.skip('#calcStacks', () => {
  });
  
  /*
  describe.skip('#sample', () => {
    it('should do something', () => {
      expect(true).toBe(false);
    });
  });
  */
});