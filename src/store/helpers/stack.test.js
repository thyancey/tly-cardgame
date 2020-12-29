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

  describe.skip('#doesOverlap', () => {
    it('simple enough to skip for now', () => {
      expect(true).toBe(false);
    });
  });

  describe.skip('#sample', () => {
    it('should do something', () => {
      expect(true).toBe(false);
    });
  });
});