import { LinkedList } from '../../../parser/util/LinkedList';
import { _ } from 'underscore';
require('chai').should();

describe('parser', () => {
  describe('util', () => {
    describe('LinkedList', () => {
      it('should have size 0 when empty', () => {
        let list = new LinkedList();
        list.should.exist;
        list.size.should.equal(0);
      });

      it('should have undefined fields on empty construction', () => {
        let list = new LinkedList();
        _.isUndefined(list.head).should.be.true;
        _.isUndefined(list.tail).should.be.true;
      });

      it('should throw an error when trying to set the head', () => {
        let list = new LinkedList().push('one', 1);
        let headSetter = () => {
          list.head = 'not one';
        };
        headSetter.should.throw(Error);
      });

      it('should throw an error when trying to set the tail', () => {
        let list = new LinkedList().push('one', 1);
        let tailSetter = () => {
          list.tail = 2;
        };
        tailSetter.should.throw(Error);
      });

      it('should throw an error when trying to set the size', () => {
        let list = new LinkedList().push('one', 1);
        let sizeSetter = () => {
          list.size = 2;
        };
        sizeSetter.should.throw(Error);
      });

      it('should have correct links', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('hello');
        let list3 = list2.push('world');
        _.isUndefined(list1.head).should.be.true;
        list2.head.should.equal('hello');
        list3.head.should.equal('world');
        _.isUndefined(list1.tail).should.be.true;
        list2.tail.should.equal(list1);
        list3.tail.should.equal(list2);
        list1.size.should.equal(0);
        list2.size.should.equal(1);
        list3.size.should.equal(2);
      });

      it('should be persistent', () => {
        let list1 = new LinkedList();
        let list2 = list1.push('common');
        let list3 = list2.push('hello');
        let list4 = list2.push('world');
        list2.head.should.equal('common');
        list3.head.should.equal('hello');
        list3.tail.head.should.equal('common');
        list4.head.should.equal('world');
        list4.tail.head.should.equal('common');
      });
    });
  });
});
