import { Environment } from '../parser/util/Environment';
import { LinkedList } from '../parser/util/LinkedList';
const assert = require('assert');

describe('parser', () => {
  describe('util', () => {
    describe('Environment', () => {
      it('should be an instance of LinkedList', () => {
        let list = new Environment();
        assert(list instanceof LinkedList);
      });
      it('should be able to lookup values', () => {
        let object = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5
        };
        let list = new Environment();
        for (let key in object) {
          list = list.push(key, object[key]);
        }
        assert.strictEqual(list.lookup('one'), 1, 'one');
        assert.strictEqual(list.lookup('two'), 2, 'one');
        assert.strictEqual(list.lookup('three'), 3, 'one');
        assert.strictEqual(list.lookup('four'), 4, 'one');
        assert.strictEqual(list.lookup('five'), 5, 'one');
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
        one.head(9);
        assert.strictEqual(four.lookup('one'), -1, 'four should still be -1');
        assert.strictEqual(three.lookup('one'), 9,
          'three should find new value of 9');
      });
    });
  });
});
