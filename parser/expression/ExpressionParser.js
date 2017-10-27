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
    let result = this.typedExpression();
    return result === undefined || result[1] !== 'string'
      ? undefined
      : result[0];
  }

  /**
   * Checks if next token is a valid flag expression.
   */
  flagExpression () {
    let result = this.typedExpression();
    return result === undefined || result[1] !== 'flag'
      ? undefined
      : result[0];
  }

  /**
   * Checks if next token is a valid truthy/falsey expression.
   */
  integerExpression () {
    let result = this.typedExpression();
    return result === undefined || result[1] !== 'int'
      ? undefined
      : result[0];
  }

  /**
   * Checks if next token is a valid truthy/falsey expression. For Rainscript,
   * the only truthy/falsey expressions are of type 'int' and 'flag'.
   */
  truthyFalseyExpression () {
    let result = this.typedExpression();
    return result === undefined || (result[1] !== 'flag' && result[1] !== 'int')
      ? undefined
      : result[0];
  }
}
