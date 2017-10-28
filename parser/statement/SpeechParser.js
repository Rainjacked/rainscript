export class SpeechParser {
  /**
   * Checks if next token is a speech dialogue.
   */
  speech () {
    let checkpoint = this.index;
    let statement = this.statementGeneric();
    if (statement !== undefined) {
      this.whitespace();
      if (this.character(':')) {
        this.whitespace();
        // expect dialogue
        let dialogue = this.stringExpression();
        if (dialogue !== undefined) {
          return this.wrapper.speech(statement, dialogue);
        }
      } else {
        this.warning('expected colon \':\' after \'' + statement.name);
      }
    }
    return this.undo(this.index - checkpoint);
  }
  /**
   * Checks if next token is a narration dialogue.
   */
  narration () {
    let narration = this.stringExpression();
    if (narration !== undefined) {
      return this.wrapper.narration(narration);
    }
  }
}
