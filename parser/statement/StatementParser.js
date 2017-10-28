const START = /[a-zA-Z_$]/;
const CONTENT = /[a-zA-Z0-9_]/;
const SPLIT = /[.-:]/;
export class StatementParser {
  statement () {
    return this.speech() || this.exclamation() || this.effect() ||
      this.narration();
  }
  /**
   * Checks if valid exclamation statement.
   */
  exclamation () {
    if (this.character('!')) {
      return this.statementGeneric();
    }
  }
  /**
   * Checks if valid effect statement.
   */
  effect () {
    // special case: if-effect
    let checkpoint = this.index;
    let ifEffect = this.ifEffect();
    if (ifEffect !== undefined) {
      return this.wrapper.statement('@if', {condition: ifEffect});
    }
    // special case: input-effect
    let inputEffect = this.inputEffect();
    if (inputEffect !== undefined) {
      return this.wrapper.statement('@input', {
        var: inputEffect === null ? null : this.wrapper.dereference(inputEffect)
      });
    }
    if (this.character('@')) {
      // special case: if-effect
      let result = this.statementGeneric();
      if (result !== undefined) {
        result.name = '@' + result.name;
        return result;
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if statement name is valie.
   */
  statementName () {
    let checkpoint = this.index;
    if (START.test(this.peek())) {
      let buffer = this.next();
      let split = true;
      while (true) {
        if (CONTENT.test(this.peek())) {
          buffer += this.next();
          split = false;
        } else if (!split && SPLIT.test(this.peek())) {
          buffer += this.next();
          split = true;
        } else {
          break;
        }
      }
      if (split) {
        this.undo(1);
        buffer = buffer.slice(0, -1);
        this.warning('uncontinued statement name');
      }
      return buffer.trim();
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if valid generic statement, returns wrapped statement on success.
   */
  statementGeneric () {
    let checkpoint = this.index;
    let name = this.statementName();
    if (name !== undefined) {
      this.whitespace();
      if (this.peek() === '(') {
        let args = this.argumentListExpression();
        if (args !== undefined) {
          return this.wrapper.statement(name, args);
        }
        this.error('invalid argument list after \'' + name + '\'');
      } else {
        return this.wrapper.statement(name, {});
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
