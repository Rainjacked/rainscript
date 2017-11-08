import { rainscriptTokenizer } from '../../tokenizer/rainscriptTokenizer';
require('chai').should();

describe('tokenizer', () => {
  describe('rainscriptTokenizerRules', () => {
    it('should tokenize EVENT', () => {
      let tokenizer = rainscriptTokenizer();
      let tokens = tokenizer.tokenize('[[ I AM AN EVENT ]]');
      tokens.should.be.an('array').with.lengthOf(1);
      tokens[0].should.include({
        type: 'EVENT',
        lexeme: '[[ I AM AN EVENT ]]'
      });
    });
  });
});
