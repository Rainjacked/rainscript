const safeEval = require('safe-eval');

export class StringLiteralParser {
  /**
   * Decorates a parser with string literal parser.
   * @param {*} parser 
   */
  constructor (parser) {
    Object.assign(this, parser || {});
  }

  /**
   * Checks if next token is a single- or double-quoted string literal.
   */
  quotedStringLiteral () {
    return this.singleQuotedStringLiteral() || this.doubleQuotedStringLiteral();
  }

  /**
   * Checks if next token is a single-quoted string literal.
   */
  singleQuotedStringLiteral () {
    let checkpoint = this.index;
    if (this.character('\'')) {
      let string = '\'';
      let escape = false;
      let trim = false;
      while (escape || !this.character('"')) {
        if (!escape && this.character('\\')) {
          string += '\\';
          escape = true;
        } else {
          if (escape && this.character('{')) {
            string += '\\{';
          } else if (escape) {
            string += this.get();
          } else {
            if (this.character('\n')) {
              trim = true;
              string = string.trimRight();
            } else if (!(trim && this.whitespace())) {
              trim = false;
              string += this.get();
            }
          }
          escape = false;
        }
      }
      string += '\'';
      try { // TODO: parse without eval
        return safeEval(string);
      } catch (e) {
        console.error(e);
        this.error('invalid single-quoted string literal');
      }
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a double-quoted string literal.
   */
  doubleQuotedStringLiteral () {
    let checkpoint = this.index;
    if (this.character('"')) {
      let string = '"';
      let escape = false;
      let trim = false;
      while (escape || !this.character('"')) {
        if (!escape && this.character('\\')) {
          string += '\\';
          escape = true;
        } else {
          if (escape && this.character('{')) {
            string += '\\{';
          } else if (escape) {
            string += this.get();
          } else {
            if (this.character('\n')) {
              trim = true;
              string = string.trimRight();
            } else if (!(trim && this.whitespace())) {
              trim = false;
              string += this.get();
            }
          }
          escape = false;
        }
      }
      string += '"';
      try { // TODO: parse without eval
        return safeEval(string);
      } catch (e) {
        console.error(e);
        this.error('invalid double-quoted string literal');
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
