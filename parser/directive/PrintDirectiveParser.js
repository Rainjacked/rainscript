export class PrintDirectiveParser {
  /**
   * Checks if print directive.
   */
  printDirective () {
    let checkpoint = this.input;
    if (this.phrase('print')) {
      if (this.whitespace()) {
        let expression = this.expression();
        if (expression !== undefined) {
          return this.wrapper.print(expression);
        }
        this.error('exprected expression after \'print\'');
      }
    }
    return this.undo(this.input - checkpoint);
  }
}
