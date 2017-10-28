export class InputDirectiveParser {
  /**
   * Checks if input directive.
   */
  inputDirective () {
    let checkpoint = this.index;
    if (this.phrase('input')) {
      if (this.whitespace()) {
        let variable = this.variableExpression();
        if (variable !== undefined) {
          return this.wrapper.input(variable);
        }
        // this.error('expected variable after \'input\'');
      }
      return this.wrapper.input(null);
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if input effect. Special case.
   */
  inputEffect () {
    let checkpoint = this.index;
    if (this.phrase('@input')) {
      if (this.whitespace()) {
        let variable = this.variableExpression();
        if (variable !== undefined) {
          return variable;
        }
        // this.error('expected variable after \'@input\'');
      }
      return null;
    }
    return this.undo(this.index - checkpoint);
  }
}
