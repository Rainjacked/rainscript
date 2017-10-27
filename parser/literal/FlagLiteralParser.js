export class FlagLiteralParser {
  /**
   * Decorates a parser with an flag literal parser.
   * @param {*} parser 
   */
  constructor (parser) {
    // require other parsers
    Object.assign(this, parser || {});
  }

  /**
   * Checks if next token is an flag literal.
   */
  flagLiteral () {
    if (this.phrase('true')) return true;
    else if (this.phrase('false')) return false;
    else return undefined;
  }
}
