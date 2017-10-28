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
        this.error('expected variable after \'input\'');
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
