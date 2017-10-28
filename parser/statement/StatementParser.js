const START = /[a-zA-Z_!@$]/;
const CONTENT = /[a-zA-Z0-9_]/;
const SPLIT = /[.-:]/;
export class StatementParser {
  statementName () {
    let checkpoint = this.index;
    if (START.test(this.peek())) {
      let buffer = this.next();
      let split = false;
      while (true) {
        if (CONTENT.test(this.peek())) {
          buffer += this.next();
          split = false;
        } else if (!split && SPLIT.test(this.peek())) {
          buffer += this.next();
          split = true;
        } else {
          break;
        }
      }
      if (split) {
        this.warning('uncontinued statement name');
      }
      return buffer.trim();
    }
    return this.undo(this.index - checkpoint);
  }
}
