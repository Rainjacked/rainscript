const ARG_KEY_DELIMITERS = /[=,)]/;
const ARG_VAL_DELIMITERS = /[,)]/;

export class ArgumentExpressionParser {
  /**
   * Checks if the next token is an named argument list.
   */
  argumentListExpression () {
    let checkpoint = this.index;
    if (this.character('(')) {
      let args = {};
      let invalid = false;
      do {
        this.whitespace();
        let arg = this.argumentExpression();
        if (arg !== undefined) {
          if (arg.length === 2) {
            // key-value pair
            args[arg[0]] = arg[1];
          } else if (arg.length === 1) {
            // manage value / key only
            if ('' in args) {
              args[arg[0]] = true;
            } else {
              args[''] = arg[0];
            }
          } else {
            console.error('unknown error in compiler?? argumentListExpression');
          }
        } else {
          this.error('invalid argument in argument list');
          invalid = true;
          break;
        }
        this.whitespace();
      } while (this.character(','));
      if (!invalid) {
        if (this.character(')')) {
          return args;
        }
        this.error('expected closing parenthesis \')\' in argument list');
      }
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid value at the right-hand-side of an
   * argument.
   */
  argumentValueExpression () {
    let checkpoint = this.index;
    // value might be an expression
    let value = this.typedExpression();
    if (value !== undefined) {
      return value[0];
    }
    // value might be an atomic phrase
    value = this.atomicPhrase(ARG_VAL_DELIMITERS);
    if (value !== undefined) {
      // TODO: embed if needed
      return value;
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid argument.
   */
  argumentExpression () {
    let checkpoint = this.index;
    let expression = this.typedExpressionNoEquals();
    if (expression !== undefined) {
      // check if expression is an assignment
      this.whitespace();
      if (!this.character('=')) { // single expression without assignment
        return [expression[0]];
      }
      // argument with assignment
      this.whitespace();
      let key = expression;
      if (key[1] !== 'string') { // cast to string first
        key[0] = this.wrapper.typeCast(key[0]);
      }
      let value = this.argumentValueExpression();
      if (value !== undefined) {
        return [key[0], value];
      }
      this.error('expected value after \'=\' in argument');
    } else {
      // key might be an atomic phrase
      let key = this.atomicPhrase(ARG_KEY_DELIMITERS);
      // TODO: embed if needed
      if (key !== undefined) {
        this.whitespace();
        if (!this.character('=')) { // single expression without assignment
          return [key];
        }
        // argument with assignment
        this.whitespace();
        let value = this.argumentValueExpression();
        if (value !== undefined) {
          return [key, value];
        }
        this.error('expected value after \'=\' in argument');
      }
    }
    return this.undo(this.index - checkpoint);
  }
}
