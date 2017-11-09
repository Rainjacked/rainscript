import { rainscriptTokenizer } from '../../tokenizer/rainscriptTokenizer';
require('chai').should();

describe('tokenizer', () => {
  describe('rainscriptTokenizerRules', () => {
    describe('EVENT', () => {
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

    describe('VAR_SUFFIX', () => {
      it('should tokenize VAR_SUFFIX', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('p055ible_var_name');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'VAR_SUFFIX',
          lexeme: 'p055ible_var_name'
        });
      });
      // TODO: add more comprehensive tests for VAR_SUFFIX
    });
  });
});
