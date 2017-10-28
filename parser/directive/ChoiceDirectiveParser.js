export class ChoiceDirectiveParser {
  /**
   * Checks if next token is a valid choice directive.
   */
  choiceDirective () {
    let checkpoint = this.index;
    if (this.phrase('#choice')) {
      // create a new block
      let block = this.environment;
      this.whitespace();
      let preamble = this.eventBody();
      this.whitespace();
      let routes = [];
      let error = false;
      while (!this.phrase('#endchoice')) {
        let route = this.route();
        if (route === undefined) {
          this.error('expected route in #choice');
          error = true;
          break;
        }
        routes.push(route);
      }
      // reset environment
      this.environment = block;
      if (!error) {
        return this.wrapper.choice(preamble, routes);
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if next token is a valid route of a choice.
   */
  choiceRoute () {
    let checkpoint = this.index;
    if (this.phrase('=>')) {
      let block = this.environment;
      let label = this.atomicPhrase(/\n/); // todo: if embeddable
      if (label !== undefined) {
        this.whitespace();
        let body = this.eventBody();
        if (body !== undefined) {
          return this.wrapper.choiceRoute(label, body);
        }
      }
      // reset environment
      this.environment = block;
    }
    return this.undo(this.index - checkpoint);
  }
}
