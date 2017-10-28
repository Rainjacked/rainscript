export class FlagLiteralParser {
  /**
   * Checks if next token is an flag literal.
   */
  flagLiteral () {
    if (this.phrase('true')) return true;
    else if (this.phrase('false')) return false;
    else return undefined;
  }
}
