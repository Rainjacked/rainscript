import { _ } from 'lodash';

// Private fields of LinkedList object
const _head = new WeakMap();
const _tail = new WeakMap();
const _size = new WeakMap();

/**
 * A singly persistent linked list.
 */
export class LinkedList {
  /**
   * Constructs a new LinkedList.
   * @param {*} head data associated with the first node in the linked list
   * @param {LinkedList} tail a pointer to the next node in the linked list
   * @throws {Error} when head is undefined or tail is not a LinkedList instance
   */
  constructor (head, tail) {
    if (_.isUndefined(head)) {
      if (_.isUndefined(tail)) {
        // construct empty linked list
        _head.set(this, undefined);
        _tail.set(this, undefined);
        _size.set(this, 0);
      } else {
        throw new Error('head of LinkedList object cannot be undefined');
      }
    } else {
      // construct from head and another linked list
      if (tail instanceof LinkedList) {
        _head.set(this, head);
        _tail.set(this, tail);
        _size.set(this, tail.size + 1);
      } else {
        throw new Error('tail must be a LinkedList instance');
      }
    }
  }

  /**
   * Gets the data of the first of this linked list.
   * @return {*} the data at the first node of this linked list
   */
  get head () {
    return _head.get(this);
  }

  /**
   * Gets the next nodes, represented by another linked list.
   * @return {LinkedList} the next nodes of this linked list
   */
  get tail () {
    return _tail.get(this);
  }

  /**
   * Gets the number of nodes of this linked list.
   * @return {int} the number of nodes of the linked list
   */
  get size () {
    return _size.get(this);
  }

  /**
   * Creates a new LinkedList extended with data as new head.
   * @param {*} data the new head of the extended linked list
   * @throws {Error} if data is not defined
   * @return {LinkedList} a new LinkedList with the new data as the first node
   */
  push (data) {
    if (_.isUndefined(data)) {
      throw new Error('LinkedList.data cannot be undefined');
    } else {
      return new LinkedList(data, this);
    }
  }
}
