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
    return this.transpilerFormat().eventFile(mainEvent, subEvents);
  }
}
