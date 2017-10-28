export class DirectiveParser {
  directive () {
    return this.choiceDirective() || this.conditionalDirective() ||
      this.assignmentDirective() || this.gotoDirective() ||
      this.printDirective() || this.inputDirective();
  }
}
