import { LinkedList } from '../parser/util/LinkedList';
const assert = require('assert');

describe('parser', () => {
  describe('util', () => {
    describe('LinkedList', () => {
      it('should have size 0 when empty', () => {
        let list = new LinkedList();
        assert.ok(list);
        assert(list.size() === 0);
      });
      it('should have undefined fields on empty construction', () => {
        let list = new LinkedList();
        assert(list.head() === undefined);
        assert(list.tail() === undefined);
      });
      it('should have correct links', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('hello');
        let list3 = list2.push('world');
        assert(list1.head() === undefined, 'list 1 head undefiend');
        assert(list2.head() === 'hello', 'list 2 head hello');
        assert(list3.head() === 'world', 'list 3 head world');
        assert(list1.tail() === undefined, 'list 1 tail undefined');
        assert(list2.tail() === list1, 'list 2 tail list 1');
        assert(list3.tail() === list2, 'list 3 tail list 2');
        assert(list1.size() === 0, 'list 1 size 0');
        assert(list2.size() === 1, 'list 2 size 1');
        assert(list3.size() === 2, 'list 3 size 2');
      });
      it('should be persistent', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('common');
        let list3 = list2.push('hello');
        let list4 = list2.push('world');
        assert(list2.head() === 'common', 'list 2 head common');
        assert(list3.head() === 'hello', 'list 3 head hello');
        assert(list3.tail().head() === 'common', 'list 3 parent common');
        assert(list4.head() === 'world', 'list 4 world');
        assert(list4.tail().head() === 'common', 'list 4 parent common');
        // set new head
        list2.head('not common');
        assert(list3.head() === 'hello', 'list 3 head common');
        assert(list3.tail().head() === 'not common', 'list 3 parent not common');
        assert(list4.head() === 'world', 'list 4 head world');
        assert(list4.tail().head() === 'not common', 'list 3 parent is missing');
      });
    });
  });
});
