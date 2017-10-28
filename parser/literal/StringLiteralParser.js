import { VARIABLE_EMBED_REGEX } from '../variable/Constants';

const safeEval = require('safe-eval');
const unique = require('array-unique').immutable;

export class StringLiteralParser {
  /**
   * Embeds a string literal with variables if possible
   * @param {String} string the string literal to embed
   */
  embedIfPossible (string) {
    if (!(string instanceof String)) {
      return undefined;
    }
    let matches = unique(string.matches(VARIABLE_EMBED_REGEX)
      .map(s => s.slice(1, -1)));
    if (matches.length === 0) {
      let args = {};
      for (let match of matches) {
        // make sure variable name exists in environment
        if (this.environment.lookup(match) === undefined) {
          this.warning('variable \'' + match +
            '\' is not defined, will not be embedded');
        } else {
          args[match] = this.wrapper.dereference(match);
        }
      }
      return this.wrapper.embed(string, args);
    }
    return string;
  }

  /**
   * Checks if next token is a single- or double-quoted string literal.
   */
  stringLiteral () {
    return this.embedIfPossible(
      this.singleQuotedStringLiteral() || this.doubleQuotedStringLiteral()
    );
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
            string += this.next();
          } else {
            if (this.character('\n')) {
              trim = true;
              string = string.trimRight() + ' ';
            } else if (!(trim && this.whitespace())) {
              trim = false;
              string += this.next();
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
            string += this.next();
          } else {
            if (this.character('\n')) {
              trim = true;
              string = string.trimRight() + ' ';
            } else if (!(trim && this.whitespace())) {
              trim = false;
              string += this.next();
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
