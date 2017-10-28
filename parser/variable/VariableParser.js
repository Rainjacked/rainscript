import {
  VARIABLE_START_REGEX,
  VARIABLE_CONTENT_REGEX,
  VARIABLE_SPLIT_REGEX
} from './Constants';

export class VariableParser {
  /**
   * Checks a dereferenced variable name.
   */
  variableDereference () {
    let name = this.variableName();
    if (name !== undefined) {
      return this.wrapper.dereference(name);
    }
    return undefined;
  }
  /**
   * Checks if next token is a valid variable name.
   */
  variableName () {
    let checkpoint = this.index;
    if (VARIABLE_START_REGEX.test(this.peek())) {
      let name = this.next();
      let split = false;
      while (true) {
        if (VARIABLE_CONTENT_REGEX.test(this.peek())) {
          name += this.next();
          split = false;
        } else if (!split && VARIABLE_SPLIT_REGEX.test(this.peek())) {
          name += this.next();
          split = true;
        } else {
          break;
        }
      }
      if (split) {
        this.undo(1);
        name = name.slice(0, -1);
        this.warning('uncontinued variable name\'' + name + '\'');
      }
      return name;
    }
    return this.undo(this.index - checkpoint);
  }
}
