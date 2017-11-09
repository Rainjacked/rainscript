import { rainscriptTokenizer } from '../../tokenizer/rainscriptTokenizer';
require('chai').should();

describe('tokenizer', () => {
  describe('rainscriptTokenizerRules', () => {
    describe('COMMENT', () => {
      it('should tokenize inline COMMENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('// inline comment\n// another');
        tokens.should.be.an('array').with.lengthOf(3);
        tokens[0].should.include({
          type: 'COMMENT',
          lexeme: '// inline comment'
        });
        tokens[2].should.include({
          type: 'COMMENT',
          lexeme: '// another'
        });
      });

      it('should tokenize block COMMENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('/* block \n comment */');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'COMMENT',
          lexeme: '/* block \n comment */'
        });
      });
    });

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
