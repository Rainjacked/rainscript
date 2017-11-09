import { _ } from 'underscore';

const _key = new WeakMap();
const _value = new WeakMap();
const _tail = new WeakMap();
const _size = new WeakMap();

/**
 * A special key-value pair linked list that can lookup values of a certain key.
 */
export class Environment {
  /**
   * Constructs a new persistent linked list environment.
   * @param {*} key 
   * @param {*} value 
   * @param {*} tail 
   * @throws {Error}
   */
  constructor (key, value, tail) {
    if (!_.isUndefined(tail)) {
      if (tail instanceof Environment) {
        if (_.isUndefined(key)) {
          throw new Error('Environment.key cannot be undefined');
        } else if (_.isUndefined(value)) {
          throw new Error('Environment.value cannot be undefined');
        } else {
          _key.set(this, key);
          _value.set(this, value);
          _tail.set(this, tail);
          _size.set(this, tail.size + 1);
        }
      } else {
        throw new Error('Environment.tail must be an instance of Environment');
      }
    } else { // if tail is not undefined
      if (!_.isUndefined(key) || !_.isUndefined(value)) {
        throw new Error('Environment.tail must be defined if key or value ' +
          'are present in the constructor');
      } else { // empty environment
        _key.set(this, undefined);
        _value.set(this, undefined);
        _tail.set(this, undefined);
        _size.set(this, 0);
      }
    }
  }

  /**
   * Gets the key of the first node of this Environment.
   * @return {*} the key at the first node of this environment
   */
  get key () {
    return _key.get(this);
  }

  /**
   * Gets the value of the first node of this Environment.
   * @return {*} the value at the first node of this environment
   */
  get value () {
    return _value.get(this);
  }

  /**
   * Gets the next nodes, represented by another linked list.
   * @return {LinkedList} the next nodes of this linked list
   */
  get tail () {
    return _tail.get(this);
  }

  /**
   * Gets the number of nodes of this linked list environment.
   * @return {int} the number of nodes of the environment
   */
  get size () {
    return _size.get(this);
  }

  /**
   * Creates a new environment with an associated key-value pair. The key nor
   * value cannot be undefined.
   * @param {*} key   the searchable identifier that maps to the value
   * @param {*} value the value associated with the key
   * @throws {Error} when key or value is undefined
   * @return a new Environment with the appended key-value pair
   */
  push (key, value) {
    if (_.isUndefined(key)) {
      throw new Error('Environment.key cannot be undefined');
    } else if (_.isUndefined(value)) {
      throw new Error('Environment.value cannot be undefined');
    } else {
      return new Environment(key, value, this);
    }
  }

  /**
   * Returns the value of the first node that matches the provided key. Returns
   * undefined if key is not found.
   * @param {*} key the searchable identifier that maps to the value
   * @throws {Error} when key is undefined
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
