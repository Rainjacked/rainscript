import { CommentsRemover } from '../util/CommentsRemover';
import { LinkedList } from '../util/LinkedList';
import { Environment } from '../util/Environment';

export class BaseParser {
  /**
   * Construct BaseParser with an empty buffer.
   */
  constructor () {
    this.replace();
  }
  /**
   * Adds a new error.
   * @param {*} message 
   */
  error (message) {
    this.errors.push([this.line, message]);
    return this.errors;
  }

  /**
   * Adds a new warning.
   * @param {*} message 
   */
  warning (message) {
    this.warnings.push([this.line, message]);
    return this.warnings;
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
      buffer.push(this.next());
    }
    return buffer.length > 0 ? buffer : undefined;
  }

  /**
   * Replaces the parser's buffer. Flowable.
   * @param {*} buffer the new buffer to replace with
   */
  replace (buffer) {
    this.buffer = '';
    this.index = 0;
    this.line = 1;
    this.errors = new LinkedList();
    this.warning = new LinkedList();
    this.environment = new Environment();
    return buffer ? this.append(buffer) : this;
  }

  /**
   * Appends new information to the buffer. Flowable.
   * @param {*} buffer the new information to append
   */
  append (buffer) {
    this.buffer += CommentsRemover.all(buffer);
    return this;
  }
}
