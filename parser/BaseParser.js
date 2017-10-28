import { LinkedList } from '../util/LinkedList';
import { Environment } from '../util/Environment';
import { Wrapper } from './Wrapper';

export class BaseParser {
  /**
   * Constructs this BaseParser.
   */
  constructor (wrapper) {
    this.wrapper = wrapper || new Wrapper();
    this.buffer = '';
    this.index = 0;
    this.line = 1;
    let environment = new Environment();
    // getters
    this.errors = new LinkedList();
    this.warning = new LinkedList();
    // adds a new error
    this.error = (message) => {
      this.errors = this.errors.push([this.line, message]);
      return this.errors;
    };
    // adds a new warning
    this.warning = (message) => {
      this.warnings = this.warnings.push([this.line, message]);
      return this.warnings;
    };
    // adds a new key-value pair to environment
    this.environment = () => environment;
  }

  /**
   * Retrace a number of steps (default: 1).
   * @param {int} steps the number of steps to retrace
   */
  undo (steps) {
    if (steps === undefined) steps = 1;
    while (steps > 0 && this.index > 0) {
      let ch = this.buffer[--this.index];
      if (ch === '\n') --this.line;
      --steps;
    }
  }

  /**
   * Peeks at the next character in the buffer,
   * or undefined if EOF.
   */
  peek () {
    return this.index < this.buffer.length
      ? this.buffer[this.index]
      : undefined;
  }

  /**
   * Gets the next character in the buffer,
   * or undefined if EOF.
   */
  next () {
    return this.index < this.buffer.length
      ? this.buffer[++this.index]
      : undefined;
  }

  /**
   * Checks if the next token matches a particular character
   * and returns that character, or undefined otherwise.
   * @param {String} ch the next character to check
   */
  character (ch) {
    if (ch !== undefined && this.peek() === ch) {
      let result = this.buffer[this.index++];
      if (result === '\n') ++this.line;
      return result;
    }
    return undefined;
  }

  /**
   * Checks if the next token matches a particular phrase
   * and returns that phrase, or undefined otherwise.
   * @param {String} text the next phrase to test
   */
  phrase (text) {
    if (text === undefined) return undefined;
    for (let i = 0; i < text.length; ++i) {
      if (this.character(text[i]) === undefined) {
        this.undo(i);
        return undefined;
      }
    }
    return text;
  }

  /**
   * Checks if next token is whitespace, or undefined otherwise.
   */
  whitespace () {
    let buffer = '';
    if (/\s/.test(this.peek())) {
      buffer.push(this.get());
    }
    return buffer.length > 0 ? buffer : undefined;
  }
}
