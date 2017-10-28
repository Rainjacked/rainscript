export class EventParser {
  /**
   * Checks if valid event, and returns it wrapped on success.
   */
  event () {
    let checkpoint = this.index;
    let name = this.eventName();
    if (name !== undefined) {
      this.whitespace();
      let body = this.eventBody();
      if (body !== undefined) {
        return this.wrapper.event(name, body);
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if valid event name, and returns it trimmed on success.
   */
  eventName () {
    let checkpoint = this.index;
    if (this.phrase('[[')) {
      let name = this.atomicPhrase(/[[\]]/);
      if (name !== undefined) {
        if (this.phrase(']]')) {
          return name;
        }
        this.error('expected closing double brackets \']]\' for event name');
      }
    }
    return this.undo(this.index - checkpoint);
  }

  /**
   * Checks if valid list of commands or directives.
   */
  eventBody () {
    // note: empty event body is always valid
    let commands = [];
    while (true) {
      this.whitespace();
      let command = this.command();
      if (command === undefined) break;
      // flatten command if it is an Array (for conditional directives)
      if (command instanceof Array) {
        command.forEach((x) => commands.push(x));
      }
      commands.push(command);
    }
    return commands;
  }
}
