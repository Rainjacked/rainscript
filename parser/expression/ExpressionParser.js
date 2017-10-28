export class ExpressionParser {
  /**
   * Decorates a parser with an expression parser.
   * @param {*} parser 
   */
  constructor (parser) {
    Object.assign(this, parser || {});
  }

  /**
   * Checks if next token is a valid expression.
   */
  expression () {
    let result = this.typedExpression();
    return result === undefined ? undefined : result[0];
  }

  /**
   * Checks if next token is a valid string expression.
   */
  stringExpression () {
    let checkpoint = this.index;
    let result = this.typedExpression();
    if (result !== undefined && result[1] === 'string') {
      return result[0];
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid flag expression.
   */
  flagExpression () {
    let checkpoint = this.index;
    let result = this.typedExpression();
    if (result !== undefined && result[1] === 'flag') {
      return result[0];
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid truthy/falsey expression.
   */
  integerExpression () {
    let checkpoint = this.index;
    let result = this.typedExpression();
    if (result !== undefined && result[1] === 'int') {
      return result[0];
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid truthy/falsey expression. For Rainscript,
   * the only truthy/falsey expressions are of type 'int' and 'flag'.
   */
  truthyFalseyExpression () {
    let checkpoint = this.index;
    let result = this.typedExpression();
    if (result !== undefined && (result[1] === 'int' || result[1] === 'flag')) {
      return result[0];
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if variable or parenthesized variable.
   */
  variableExpression () {
    let checkpoint = this.index;
    if (this.character('(')) {
      let variable = this.variableExpression();
      if (variable !== undefined) {
        if (this.character(')')) {
          return variable;
        }
        this.error('expected closing parenthesis \')\' in variable expression');
      }
    } else {
      let variable = this.variable();
      if (variable !== undefined) return variable;
    }
    return this.undo(this.index - checkpoint);
  }
}
