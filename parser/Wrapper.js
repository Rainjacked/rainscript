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
}
