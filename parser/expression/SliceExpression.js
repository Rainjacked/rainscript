export class SliceExpressionParser {
  sliceExpression () {
    let checkpoint = this.index;
    if (this.character('[')) {
      this.whitespace();
      let result = this.typedExpression();
      this.whitespace();
      if (result !== undefined && this.character(']')) {
        // for now, only integer or range can be sliced
        if (['range', 'int'].indexOf(result[1]) !== -1) {
          return {
            _id: 'op',
            operator: '[]',
            operands: [result[0]]
          };
        } else {
          this.error('only integer or range can be sliced []');
        }
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
