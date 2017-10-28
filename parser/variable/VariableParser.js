import {
  VARIABLE_PREFIX_LOCAL,
  VARIABLE_PREFIX_PARAM,
  VARIABLE_PREFIX_GLOBAL,
  VARIABLE_START_REGEX,
  VARIABLE_CONTENT_REGEX,
  VARIABLE_SPLIT_REGEX
} from './Constants';

export class VariableParser {
  /**
   * Checks a dereferenced variable name.
   */
  variableDereference () {
    let variable = this.variable();
    if (variable !== undefined) {
      return this.wrapper.dereference(name);
    }
    return undefined;
  }
  /**
   * Checks for next variable.
   */
  variable () {
    return this.globalVariable() ||
      this.localVariable() ||
      this.paramVariable();
  }
  /**
   * Checks if next variable is a local variable.
   */
  localVariable () {
    let checkpoint = this.index;
    if (this.character(VARIABLE_PREFIX_LOCAL)) {
      let name = this.variableName();
      if (name !== undefined) {
        return VARIABLE_PREFIX_LOCAL + name;
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if next variable is a param variable.
   */
  paramVariable () {
    let checkpoint = this.index;
    if (this.character(VARIABLE_PREFIX_PARAM)) {
      let name = this.variableName();
      if (name !== undefined) {
        return VARIABLE_PREFIX_PARAM + name;
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if next variable is a global variable.
   */
  globalVariable () {
    let checkpoint = this.index;
    if (this.character(VARIABLE_PREFIX_GLOBAL)) {
      let name = this.variableName();
      if (name !== undefined) {
        return VARIABLE_PREFIX_GLOBAL + name;
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if next token is a valid variable name.
   */
  variableName () {
    let checkpoint = this.index;
    if (VARIABLE_START_REGEX.test(this.peek())) {
      let name = this.next();
      let split = true;
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
