export class OperatorFactory {
  constructor () {
    /* setup functions via factory */
    // special binary operators here
    this.binaryOperations = {
      '*,int,string': 'string',
      '*,string,int': 'string',
      '+,string,string': 'string',
      'to,int,int': 'range' // special type
    };
    // logical operators return flag, with truthy/falsey int values
    this.logicalOperations = ['or', 'nor', 'xor', 'and', 'nand',
      '<', '>', '<=', '>=', '=', '!=', '&', '|', '^'];
    for (let op of this.logicalOperations) {
      this.binaryOperations[[op, 'flag', 'flag']] =
      this.binaryOperations[[op, 'flag', 'int']] =
      this.binaryOperations[[op, 'int', 'flag']] =
      this.binaryOperations[[op, 'int', 'int']] = 'flag';
    }
    // relational operators always return flag
    this.relationalOperations = ['<', '>', '<=', '>=', '=', '!='];
    for (let op of this.relationalOperations) {
      this.binaryOperations[[op, 'flag', 'flag']] =
      this.binaryOperations[[op, 'int', 'int']] =
      this.binaryOperations[[op, 'string', 'string']] = 'flag';
    }
    // arithmetic operators return int
    this.arithmeticOperations = ['&', '|', '^', '<<', '>>', '+', '-', '*', '/'];
    for (let op of this.arithmeticOperations) {
      this.binaryOperations[[op, 'int', 'int']] = 'int';
    }
    this.unaryOperations = {
      '+,int': 'int',
      '-,int': 'int',
      '~,int': 'int',
      '~,flag': 'flag',
      'not,int': 'flag',
      'not,flag': 'flag'
    };
    // use this list to define order of binary operations for expression parser
    this.orderOfBinaryOperations = [
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
    this.orderOfUnaryOperations = [
      ['+', '-', '~', 'not ']
    ];
  }
  /**
   * Creates expression function from this factory's list of operations.
   * @param {function} expression the leaf expression parser function
   * @param {boolean}  exclude    binary operations to exclude 
   */
  createExpressionFunction (expression, exclude) {
    exclude = exclude || [];
    // incrementally wrap expression parser depending on order of operations
    for (let unaryOperations of this.orderOfUnaryOperations) {
      expression = this.createTypedUnaryOperation(expression,
        unaryOperations);
    }
    for (let binaryOperations of this.orderOfBinaryOperations) {
      let operations = [];
      for (let operation of binaryOperations) {
        if (exclude.indexOf(operation) !== -1) {
          operations.push(operation);
        }
      }
      expression = this.createTypedLeftToRightBinaryOperation(expression,
        operations);
    }
    return expression;
  }

  /**
   * Gets the return type of a binary operation.
   * @param {*} op    the name of a binary operator
   * @param {*} type1 the data type at the left-hand side operand
   * @param {*} type2 the data type at the right-hand side operand
   */
  binaryOperationReturnType (op, type1, type2) {
    if (type1 === undefined || type2 === undefined) {
      return undefined;
    }
    return this.binaryOperations[[op, type1, type2]];
  }

  /**
   * Gets the return type of a unary operation.
   * @param {*} op    the name of the unary operation
   * @param {*} type1 the data type of the operand
   */
  unaryOperationReturnType (op, type1) {
    if (type1 === undefined) {
      return undefined;
    }
    return this.unaryOperations[[op, type1]];
  }

  /**
   * Creates a pre-unary operation that operates in the correct evaluation
   * order.
   * @param {*} nextLevel a higher priority operation
   * @param {*} operands  a list of unary operands of the same priority
   */
  createTypedUnaryOperation (nextLevel, operands) {
    let self = this;
    return currentLevel;
    function currentLevel () {
      let checkpoint = self.index;
      for (let operand of operands) {
        let name = operand.trim();
        if (operand[0] !== ' ' || self.whitespace()) {
          if (self.phrase(name)) {
            if (operand[operand.length - 1] !== ' ' || self.whitespace()) {
              // at this point, unary operation has already been parsed
              // try again for nested unary operations of the same level
              let S = currentLevel();
              if (S !== undefined) {
                let type = self.unaryOperationReturnType(name, S[1]);
                // warn if unknown return type
                if (type === undefined && S[1] !== undefined) {
                  self.warning('undefined unary operation: ' +
                    name + ' <' + S[1] + '>');
                }
                // perform unary operation
                return [{
                  _id: 'op',
                  operator: name,
                  operands: [S[0]]
                }, type];
              }
            }
          }
        }
        self.undo(self.index - checkpoint);
      }
      return nextLevel();
    }
  }

  /**
   * Creates a parser for a left-to-right binary operation that operates in
   * the correct evaluation order.
   * @param {*} nextLevel a higher priority operation
   * @param {*} operands  a list of binary operands of the same priority
   */
  createTypedLeftToRightBinaryOperation (nextLevel, operands) {
    let self = this;
    return () => {
      let checkpoint = self.index;
      let S1 = nextLevel();
      if (S1 !== undefined) {
        let hasOperator = true;
        while (hasOperator) {
          hasOperator = false;
          let operatorCheckpoint = self.index;
          // try one of the operands
          for (let operand of operands) {
            let name = operand.trim();
            if (operand[0] !== ' ' || self.whitespace()) {
              if (self.phrase(name)) {
                if (operand[operand.length - 1] !== ' ' || self.whitespace()) {
                  let S2 = nextLevel();
                  if (S2 !== undefined) {
                    let type = self.binaryOperationReturnType(name, S1[1],
                      S2[1]);
                    // collate binary operation, left-to-right
                    S1 = [{
                      _id: 'op',
                      operator: name,
                      operands: [S1[0], S2[0]]
                    }, type];
                    hasOperator = true;
                    // warn if return type is undefined
                    if (type === undefined &&
                      S1[1] !== undefined &&
                      S2[1] !== undefined) {
                      self.warning('undefined binary operation: <' + S1[1] +
                        '> ' + operand + ' ' + name + ' <' + S2[1] + '>');
                    }
                    // break out of operator loop, continue parsing level
                    break;
                  }
                }
              }
            }
            self.undo(self.index - operatorCheckpoint);
          }
        }
        return S1;
      }
      return self.undo(self.index - checkpoint);
    };
  }
}
