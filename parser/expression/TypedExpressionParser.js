import { TypedExpressionParserFactory } from '.';
export class TypedExpressionParser {
  /**
   * Decorates a parser with a typed expression parser.
   * @param {*} parser 
   */
  constructor () {
    /* setup functions via factory */
    let factory = new TypedExpressionParserFactory();
    // special binary operators here
    factory.binaryOperations = {
      '*,int,string': 'string',
      '*,string,int': 'string',
      '+,string,string': 'string',
      'to,int,int': null
    };
    // logical operators return flag, with truthy/falsey int values
    let logical = ['or', 'nor', 'xor', 'and', 'nand',
      '<', '>', '<=', '>=', '=', '!=', '&', '|', '^'];
    for (let op of logical) {
      factory.binaryOperations[[op, 'flag', 'flag']] =
      factory.binaryOperations[[op, 'flag', 'int']] =
      factory.binaryOperations[[op, 'int', 'flag']] =
      factory.binaryOperations[[op, 'int', 'int']] = 'flag';
    }
    // relational operators always return flag
    let relational = ['<', '>', '<=', '>=', '=', '!='];
    for (let op of relational) {
      factory.binaryOperations[[op, 'flag', 'flag']] =
      factory.binaryOperations[[op, 'int', 'int']] =
      factory.binaryOperations[[op, 'string', 'string']] = 'flag';
    }
    // arithmetic operators return int
    let arithmetic = ['&', '|', '^', '<<', '>>', '+', '-', '*', '/'];
    for (let op of arithmetic) {
      factory.binaryOperations[[op, 'int', 'int']] = 'int';
    }
    factory.unaryOperations = {
      '+,int': 'int',
      '-,int': 'int',
      '~,int': 'int',
      '~,flag': 'flag',
      'not,int': 'flag',
      'not,flag': 'flag'
    };
    // use this list to define order of binary operations for expression parser
    let orderOfBinaryOperations = [
      [' or ', ' nor '],
      [' xor '],
      [' and ', ' nand '],
      ['<', '<=', '>', '>=', '=', '!='], // TODO: relational chains
      [' to '],
      ['|'],
      ['^'],
      ['&'],
      ['>>', '<<'],
      ['+', '-'],
      ['*', '/', '%']
    ];
    // use this list to define order of unary operations for expression parser
    let orderOfUnaryOperations = [
      ['+', '-', '~', 'not ']
    ];
    // create base case for typed expression
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
        return [{
          _id: 'op',
          operator: '<>',
          operands: [cast, result[0]]
        }, cast];
      }
      return result;
    };
    // incrementally wrap expression parser depending on order of operations
    for (let unaryOperations of orderOfUnaryOperations) {
      expression = factory.createTypedUnaryOperation(expression,
        unaryOperations);
    }
    for (let binaryOperations of orderOfBinaryOperations) {
      expression = factory.createTypedLeftToRightBinaryOperation(expression,
        binaryOperations);
    }
    // finally, add this to class methods

    /**
     * Checks if the next token is an expandable expression.
     */
    this.typedExpression = expression;
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
      let result = this.typedExpression();
      if (this.character(')')) {
        return result;
      } else {
        this.error('expected closing parenthesis');
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
