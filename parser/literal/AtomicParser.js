export class AtomicParser {
  /**
   * Decorates a parser with an atomic literal parser.
   * @param {*} parser 
   */
  constructor (parser) {
    // require other parsers
    Object.assign(this, parser || {});
  }

  /**
   * Parses an atomic phrase, given a set of regex delimiters.
   */
  atomicPhrase (delimiters) {
    let checkpoint = this.index;
    let buffer = '';
    let trim = false;
    while (this.peek() !== undefined && !delimiters.test(this.peek())) {
      if (trim && /\s/.test(this.peek())) {
        // note: don't use this.whitespace(),
        // might conflict on a whitespace delimiter
        this.next();
        continue;
      }
      if (this.character('\n')) {
        // collapse into a single space
        buffer = buffer.trimRight() + ' ';
        trim = true;
      } else {
        trim = false;
      }
    }
    buffer = buffer.trim();
    if (buffer.length > 0) return buffer;
    else return this.undo(this.index - checkpoint);
  }
}
