import { LinkedList } from './LinkedList';

/**
 * A special key-value pair linked list that can
 * lookup values of a certain key.
 */
export class Environment extends LinkedList {
  /**
   * Creates a new environment with an associated
   * key-value pair.
   * @param {*} key 
   * @param {*} value 
   * @return a new Environment with the appended key-value
   *         pair
   */
  push (key, value) {
    return super.push([key, value]);
  }
  /**
   * Searches for the value of the nearest key
   * in this environment.
   * @param {*} key 
   * @return the value of the nearest key, or undefined
   *         if not found
   */
  lookup (key) {
    if (this.head() === undefined) {
      return undefined;
    }
    if (this.head()[0] === key) {
      return this.head()[1];
    }
    return this.tail().find(key);
  }
}
