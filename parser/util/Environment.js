import { LinkedList } from './LinkedList';
import { _ } from 'underscore';

/**
 * A special key-value pair linked list that can lookup values of a certain key.
 */
export class Environment extends LinkedList {
  /**
   * Creates a new environment with an associated key-value pair. The key nor
   * value cannot be undefined.
   * @param {*} key   the searchable identifier that maps to the value
   * @param {*} value the value associated with the key
   * @return a new Environment with the appended key-value pair
   */
  push (key, value) {
    if (_.isUndefined(key)) {
      throw new Error('Environment.key cannot be undefined');
    } else if (_.isUndefined(value)) {
      throw new Error('Environment.value cannot be undefined');
    } else {
      return new Environment([key, value], this);
    }
  }

  /**
   * Don't allow accessing the head directly.
   * @throws {Error}
   */
  get head () {
    throw new Error('it is not advised to access Environment.head directly; ' +
      'use Environment.key or Environment.value instead');
  }

  /**
   * Gets the key of the first node of this Environment.
   * @return {*} the key at the first node of this environment
   */
  get key () {
    if (_.isUndefined(super.head)) {
      return undefined;
    }
    return super.head[0];
  }

  /**
   * Gets the value of the first node of this Environment.
   * @return {*} the value at the first node of this environment
   */
  get value () {
    if (_.isUndefined(super.head)) {
      return undefined;
    }
    return super.head[1];
  }

  /**
   * Returns the value of the first node that matches the provided key. Returns
   * undefined if key is not found.
   * @param {*} key the searchable identifier that maps to the value
   * @return the value of the nearest key, or undefined if not found
   */
  lookup (key) {
    if (_.isUndefined(key)) {
      throw new Error('argument mismatch, key cannot be undefined');
    } else if (this.size === 0) {
      // not found
      return undefined;
    } else if (_.isEqual(key, this.key)) {
      // key matches
      return this.value;
    } else {
      // key does not match
      return this.tail.lookup(key);
    }
  }
}
