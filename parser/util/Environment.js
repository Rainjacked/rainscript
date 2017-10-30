import { LinkedList } from './LinkedList';

/**
 * A special key-value pair linked list that can lookup values of a certain key.
 */
export class Environment extends LinkedList {
  constructor (head, tail) {
    super(head, tail);
    let hed = this.head;
    this.head = (value) => value === undefined ? hed() : hed([hed()[0], value]);
  }
  /**
   * Creates a new environment with an associated key-value pair.
   * @param {*} key   the searchable identifier that maps to the value
   * @param {*} value the value associated with the key
   * @return a new Environment with the appended key-value pair
   */
  push (key, value) {
    return new Environment([key, value], this);
  }
  /**
   * Searches for the value of the nearest key in this environment.
   * @param {*} key the searchable identifier that maps to the value
   * @return the value of the nearest key, or undefined if not found
   */
  lookup (key) {
    if (this.head() === undefined) {
      return undefined;
    }
    if (this.head()[0] === key) {
      return this.head()[1];
    }
    return this.tail().lookup(key);
  }
}
