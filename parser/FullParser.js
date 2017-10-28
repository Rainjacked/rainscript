import { LinkedList } from './util/LinkedList';
import { Environment } from './util/Environment';
import { CommentsRemover } from './util/CommentsRemover';
import { FullParserTemplate } from './FullParserTemplate';

const fs = require('fs');
const path = require('path');

const RAINSCRIPT_EXT = '.rain';

export class FullParser {
  /**
   * Constructs this FullParser.
   */
  constructor () {
    // copy contents from template
    Object.assign(this, FullParserTemplate);
    // create buffer
    this.replace();
  }

  /**
   * Fully transpile rainscript program.
   * @param {*} program 
   */
  transpile (filename) {
    // get path information
    let basename = path.basename(filename, RAINSCRIPT_EXT);
    this.replace(fs.readFileSync(filename, 'utf8'));
    // collect multiple events
    let eventNames = {};
    let mainEvent;
    let subEvents = [];
    while (true) {
      this.whitespace();
      let event = this.event();
      if (event === undefined) {
        break;
      }
      // check if event name is duplicate
      if (event.name in eventNames) {
        this.errors('cannot have duplicate event name [[' + event.name + ']]');
      } else {
        eventNames[event.name] = true;
        if (event.name === basename) {
          mainEvent = event;
        } else {
          subEvents.push(event);
        }
      }
    }
    this.whitespace();
    if (this.peek() !== undefined) {
      this.error('did not reach end of file');
    }
    if (mainEvent === undefined) {
      this.error('main event [[' + basename + ']] not found');
    }
    return this.wrapper.transpile(mainEvent, subEvents);
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
