export class IntegerLiteralParser {
  /**
   * Checks if next token is an integer literal.
   */
  integerLiteral () {
    let result = this.integerDecimal();
    if (result === undefined) {
      result = this.integerOctal();
      if (result === undefined) {
        result = this.integerBinary();
        if (result === undefined) {
          result = this.integerHexadecimal();
        }
      }
    }
    return result;
  }

  /**
   * Checks if next token is an integer decimal literal.
   * Example: 12345
   */
  integerDecimal () {
    if (/[1-9]/.test(this.peek())) {
      let value = this.next();
      while (/[0-9]/.test(this.peek())) {
        value += this.next();
      }
      value = parseInt(value);
      if (value >= (1 << 31)) {
        this.warning('integer literal overflow');
      }
      return value;
    }
    return undefined;
  }

  /**
   * Checks if next token is an integer octal literal.
   * Example: 021547
   */
  integerOctal () {
    if (this.character('0')) {
      let value = 0;
      while (/[0-7]/.test(this.peek())) {
        value = (value << 3) | parseInt(this.next());
      }
      if (value >= (1 << 31)) {
        this.warning('integer literal overflow');
      }
      return value;
    }
    return undefined;
  }

  /**
   * Checks if next token is an integer hexadecimal literal.
   * Example: 0x1AF52
   */
  integerHexadecimal () {
    if (this.phrase('0x') || this.phrase('0X')) {
      let value = '0x';
      while (/[0-7]/.test(this.peek())) {
        value += this.next();
      }
      value = parseInt(value);
      if (value >= (1 << 31)) {
        this.warning('integer literal overflow');
      }
      return value;
    }
    return undefined;
  }

  /**
   * Checks if next token is an integer binary literal.
   * Example: 0b10101011000
   */
  integerBinary () {
    if (this.phrase('0b') || this.phrase('0B')) {
      let value = 0;
      while (/[01]/.test(this.peek())) {
        value = (value << 1) | parseInt(this.next());
      }
      if (value >= (1 << 31)) {
        this.warning('integer literal overflow');
      }
      return value;
    }
    return undefined;
  }
}
