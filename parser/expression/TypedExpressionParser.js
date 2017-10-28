import { OperatorFactory } from '../operator/OperatorFactory';

export class TypedExpressionParserTemplate {
  constructor () {
    let expression = () => {
      let result = this.typedParenthesisExpression() || this.typedData();
      if (result === undefined) return undefined;
      this.whitespace();
      // check for post-group operators
      let isString = result[1] === 'string';
      if (isString) {
        let args = this.argumentListExpression();
        if (args !== undefined) {
          return [{
            _id: 'embed',
            text: result[0],
            args: args
          }, 'string'];
        }
      }
      if (isString) {
        let slice = this.sliceExpression();
        if (slice !== undefined) {
          return [{
            _id: 'op',
            operator: '[]',
            operands: [result[0], slice]
          }, 'string'];
        }
      }
      let cast = this.typeCast();
      if (cast !== undefined) {
        return [this.wrapper.typeCast(result[0], cast), cast];
      }
      return result;
    };
    // create recursive expression parser from operator factory
    let factory = OperatorFactory();
    this.typedExpression = factory.createExpressionFunction(expression);
    this.typedExpressionNoEquals = factory.createExpressionFunction(
      expression, ['=']);
  }
  /**
   * Checks if the next token is a singular data, ie. literal
   * or variable dereference. Returns [value, type].
   */
  typedData () {
    let value = this.integerLiteral();
    if (value !== undefined) {
      return [value, 'int'];
    }
    value = this.stringLiteral();
    if (value !== undefined) {
      return [value, 'string'];
    }
    value = this.flagLiteral();
    if (value !== undefined) {
      return [value, 'flag'];
    }
    value = this.dereference();
    if (value !== undefined) {
      return [value, this.environment().lookup(value.name)];
    }
    return undefined;
  }

  /**
   * Checks if a typed expression is wrapped with parenthesis ().
   */
  typedParenthesisExpression () {
    let checkpoint = this.index;
    if (this.character('(')) {
      this.whitespace();
      let result = this.typedExpression(); // typedExpression must be defined
      if (this.character(')')) {
        return result;
      } else {
        this.error('expected closing parenthesis');
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
