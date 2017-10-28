import { BaseParser } from '../../parser/base/BaseParser';

const assert = require('assert');

describe('parser/base', () => {
  describe('BaseParser', () => {
    it('should have empty buffer', () => {
      let parser = new BaseParser();
      assert.strictEqual(parser.index, 0);
      assert.strictEqual(parser.buffer, '');
    });
  });
});
