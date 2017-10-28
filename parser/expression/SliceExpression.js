export class SliceExpressionParser {
  sliceExpression () {
    let checkpoint = this.index;
    if (this.character('[')) {
      this.whitespace();
      // for now, only integer can be sliced
      let first = this.integerExpression();
      if (first === undefined) {
        this.error('expected integer expression in slice []');
      } else {
        this.whitespace();
        if (this.phrase('to')) {
          // slice range
          if (this.whitespace() === undefined) {
            this.error('expected whitespace after \'to\'');
          } else {
            // for now, only integer can be sliced
            let second = this.integerExpression();
            if (second === undefined) {
              this.error('expected integer expression after \'to\' in slice');
            } else {
              this.whitespace();
              if (this.character(']') === undefined) {
                this.error('expected closing bracket \']\' in slice');
              } else {
                return {
                  _id: 'op',
                  operator: '[]',
                  operands: [{
                    _id: 'op',
                    operator: 'to',
                    operands: [first, second]
                  }]
                };
              }
            }
          }
        } else {
          // slice index
          return {
            _id: 'op',
            operator: '[]',
            operands: [first]
          };
        }
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
