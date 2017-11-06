import { Environment } from '../../../parser/util/Environment';
import { LinkedList } from '../../../parser/util/LinkedList';
const assert = require('assert');

describe('parser', () => {
  describe('util', () => {
    describe('Environment', () => {
      it('should be an instance of LinkedList', () => {
        let list = new Environment();
        assert(list instanceof LinkedList);
      });

      it('should be able to lookup values', () => {
        let list = new Environment();
        list = list.push('one', 1);
        list = list.push('two', 2);
        list = list.push('three', 3);
        list = list.push('four', 4);
        list = list.push('five', 5);
        assert.strictEqual(list.lookup('one'), 1);
        assert.strictEqual(list.lookup('two'), 2);
        assert.strictEqual(list.lookup('three'), 3);
        assert.strictEqual(list.lookup('four'), 4);
        assert.strictEqual(list.lookup('five'), 5);
      });

      it('should return null if key not found', () => {
        let list = new Environment();
        list = list.push('one', 1);
        assert.strictEqual(list.lookup('two'), undefined, 'key not found ' +
          'should return undefined');
        list = list.push('two', 2);
        assert.strictEqual(list.lookup('two'), 2);
      });

      it('should shadow lookups', () => {
        let zero = new Environment();
        let one = zero.push('one', 1);
        assert.strictEqual(one.lookup('one'), 1, 'one should be 1');
        let two = one.push('two', 2);
        let three = two.push('three', 3);
        let oneAgain = three.push('one', -1);
        let four = oneAgain.push('four', 4);
        assert.strictEqual(three.lookup('one'), 1, 'three should be 1');
        assert.strictEqual(four.lookup('one'), -1,
          'four should be shadowed with -1');
      });
    });
  });
});
