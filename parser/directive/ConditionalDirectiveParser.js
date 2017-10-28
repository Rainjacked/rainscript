export class ConditionalDirectiveParser {
  /**
   * Checks if next token is a fully valid if-directive.
   */
  conditionalDirective () {
    let checkpoint = this.index;
    let ifBlock = this.ifBlock();
    if (ifBlock !== undefined) {
      let conditions = [ifBlock];
      // continue with elifs
      while (true) {
        this.whitespace();
        let elifBlock = this.elifBlock();
        if (elifBlock === undefined) break;
        conditions.push(elifBlock);
      }
      // continue with single else
      this.whitespace();
      let elseBlock = this.elseBlock();
      if (elseBlock !== undefined) {
        conditions.push(elseBlock);
      }
      // end with #endif
      this.whitespace();
      if (this.phrase('#endif')) {
        return conditions;
      }
      this.error('#endif not found after #if');
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a fully valid if-effect.
   * TODO: wrap with effect if needed
   */
  ifEffect () {
    let checkpoint = this.index;
    if (this.phrase('@if')) {
      this.whitespace();
      let condition = this.truthyFalseyExpression();
      if (condition !== undefined) {
        return condition;
      }
      this.error('expected <int> or <flag> expression after @if');
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid if block.
   */
  ifBlock () {
    return this.conditionalBlock('if');
  }

  /**
   * Checks if next token is a valid elif block.
   */
  elifBlock () {
    return this.conditionalBlock('elif');
  }

  /**
   * Checks if next token is a valid else block.
   */
  elseBlock () {
    let checkpoint = this.index;
    if (this.phrase('#else')) {
      this.whitespace();
      // no condition needed, proceed straight to body
      let block = this.environment;
      let body = this.eventBody();
      // reset environment first
      this.environment = block;
      if (body !== undefined) {
        return this.wrapper.conditional('else', true, body);
      }
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if next token is a valid conditional block.
   * @param {*} type prefix to the conditional block (e.g. 'if', 'elif')
   */
  conditionalBlock (type) {
    if (type === undefined) return undefined;
    let checkpoint = this.index;
    if (this.phrase('#' + type)) {
      this.whitespace();
      let condition = this.truthyFalseyExpression();
      if (condition !== undefined) {
        this.whitespace();
        let block = this.environment; // creates a new block
        let body = this.eventBody();
        // reset environment first
        this.environment = block;
        if (body !== undefined) {
          return this.wrapper.conditional(type, condition, body);
        }
        this.error('invalid #' + type + 'block');
      }
      this.error('invalid condition after #' + type +
        ' expected <int> or <flag>');
    }
    return this.undo(this.index - checkpoint);
  }
}
