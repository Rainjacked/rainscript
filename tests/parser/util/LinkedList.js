import { LinkedList } from '../../../parser/util/LinkedList';
const assert = require('assert');

describe('parser', () => {
  describe('util', () => {
    describe('LinkedList', () => {
      it('should have size 0 when empty', () => {
        let list = new LinkedList();
        assert.ok(list);
        assert.strictEqual(list.size, 0);
      });

      it('should have undefined fields on empty construction', () => {
        let list = new LinkedList();
        assert.strictEqual(list.head, undefined);
        assert.strictEqual(list.tail, undefined);
      });

      it('should have correct links', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('hello');
        let list3 = list2.push('world');
        assert.strictEqual(list1.head, undefined, 'list 1 head undefiend');
        assert.strictEqual(list2.head, 'hello', 'list 2 head hello');
        assert.strictEqual(list3.head, 'world', 'list 3 head world');
        assert.strictEqual(list1.tail, undefined, 'list 1 tail undefined');
        assert.strictEqual(list2.tail, list1, 'list 2 tail list 1');
        assert.strictEqual(list3.tail, list2, 'list 3 tail list 2');
        assert.strictEqual(list1.size, 0, 'list 1 size 0');
        assert.strictEqual(list2.size, 1, 'list 2 size 1');
        assert.strictEqual(list3.size, 2, 'list 3 size 2');
      });

      it('should be persistent', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('common');
        let list3 = list2.push('hello');
        let list4 = list2.push('world');
        assert.strictEqual(list2.head, 'common', 'list 2 head common');
        assert.strictEqual(list3.head, 'hello', 'list 3 head hello');
        assert.strictEqual(list3.tail.head, 'common',
          'list 3 parent common');
        assert.strictEqual(list4.head, 'world', 'list 4 world');
        assert.strictEqual(list4.tail.head, 'common',
          'list 4 parent common');
      });
    });
  });
});
