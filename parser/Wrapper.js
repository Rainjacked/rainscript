export class Wrapper {
  typeCast (value, type) {
    return {
      _id: 'op',
      operator: '<>',
      operands: [value, type]
    };
  }

  slice (value) {
    return {
      _id: 'op',
      operator: '[]',
      operands: [value]
    };
  }

  conditional (name, condition, commands) {
    return {
      _id: 'directive',
      name: name,
      condition: condition,
      commands: commands
    };
  }

  choice (preamble, routes) {
    return {
      _id: 'directive',
      name: 'choice',
      preamble: preamble,
      choices: routes
    };
  }

  choiceRoute (label, commands) {
    return {
      label: label,
      commands: commands
    };
  }
}
