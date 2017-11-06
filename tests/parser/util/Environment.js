import { Environment } from '../../../parser/util/Environment';
import { LinkedList } from '../../../parser/util/LinkedList';
import { _ } from 'underscore';
require('chai').should();

describe('parser', () => {
  describe('util', () => {
    describe('Environment', () => {
      it('should be an instance of LinkedList', () => {
        new Environment().should.be.an.instanceof(LinkedList);
      });

      it('should throw an error when trying to access the head', () => {
        let list = new Environment().push('one', 1);
        let headGetter = () => {
          return list.head;
        };
        headGetter.should.throw(Error);
      });

      it('should throw an error when trying to set the head', () => {
        let list = new Environment().push('one', 1);
        let headSetter = () => {
          list.head = 'not one';
        };
        headSetter.should.throw(Error);
      });

      it('should throw an error when trying to set the key', () => {
        let list = new Environment().push('one', 1);
        let keySetter = () => {
          list.key = 'one';
        };
        keySetter.should.throw(Error);
      });

      it('should throw an error when trying to set the value', () => {
        let list = new Environment().push('one', 1);
        let valueSetter = () => {
          list.value = 1;
        };
        valueSetter.should.throw(Error);
      });

      it('should throw an error when trying to set the tail', () => {
        let list = new Environment().push('one', 1);
        let tailSetter = () => {
          list.tail = 2;
        };
        tailSetter.should.throw(Error);
      });

      it('should throw an error when trying to set the size', () => {
        let list = new Environment().push('one', 1);
        let sizeSetter = () => {
          list.size = 2;
        };
        sizeSetter.should.throw(Error);
      });

      it('should be able to lookup values', () => {
        let list = new Environment();
        list = list.push('one', 1);
        list = list.push('two', 2);
        list = list.push('three', 3);
        list = list.push('four', 4);
        list = list.push('five', 5);
        list.lookup('one').should.equal(1);
        list.lookup('two').should.equal(2);
        list.lookup('three').should.equal(3);
        list.lookup('four').should.equal(4);
        list.lookup('five').should.equal(5);
      });

      it('should return null if key not found', () => {
        let list = new Environment();
        list = list.push('one', 1);
        _.isUndefined(list.lookup('two')).should.be.true;
        _.isUndefined(list.lookup('two')).should.be.true;
        list = list.push('two', 2);
        list.lookup('two').should.equal(2);
      });

      it('should shadow lookups', () => {
        let zero = new Environment();
        let one = zero.push('one', 1);
        one.lookup('one').should.equal(1);
        let two = one.push('two', 2);
        let three = two.push('three', 3);
        let oneAgain = three.push('one', -1);
        let four = oneAgain.push('four', 4);
        three.lookup('one').should.equal(1);
        four.lookup('one').should.equal(-1, 'four should be shadowed');
      });
    });
  });
});
