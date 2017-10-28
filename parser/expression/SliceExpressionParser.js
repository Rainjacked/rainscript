export class SliceExpressionParser {
  /**
   * Checks if expression is a slice.
   */
  sliceExpression () {
    let checkpoint = this.index;
    if (this.character('[')) {
      this.whitespace();
      let result = this.typedExpression();
      this.whitespace();
      if (result !== undefined && this.character(']')) {
        // for now, only integer or range can be sliced
        if (['range', 'int'].indexOf(result[1]) !== -1) {
          return this.wrapper.slice(result[0]);
        } else {
          this.error('only integer or range can be sliced []');
        }
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
