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

  dereference (varname) {
    return {
      _id: 'ref',
      varname: varname
    };
  }

  input (variable) {
    return {
      _id: 'directive',
      name: 'input',
      var: variable !== null ? this.dereference(variable) : null
    };
  }

  print (expression) {
    return {
      _id: 'directive',
      name: 'print',
      value: expression
    };
  }

  event (name, body) {
    return {
      name: name,
      commands: body
    };
  }

  statement (name, args) {
    return {
      _id: 'statement',
      name: name,
      args: args
    };
  }
}
