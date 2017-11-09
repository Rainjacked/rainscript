import { rainscriptTokenizer } from '../../lib/tokenizer/rainscriptTokenizer';
require('chai').should();

describe('tokenizer', () => {
  describe('rainscriptTokenizerRules', () => {
    describe('STR_1', () => {
      it('should tokenize STR_1', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'hello world\'');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_1',
          lexeme: '\'hello world\''
        });
      });

      it('should escape single quotes in STR_1', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'hello \\\' world\'');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_1',
          lexeme: '\'hello \\\' world\''
        });
      });

      it('should capture inline COMMENT inside STR_1', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'this is \n // not a comment\'');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_1',
          lexeme: '\'this is \n // not a comment\''
        });
      });

      it('should capture block COMMENT inside STR_1', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'this is \n /* not a comment*/ \'');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_1',
          lexeme: '\'this is \n /* not a comment*/ \''
        });
      });

      it('should not capture unended STR_1', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'undended string');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'STR_1'
        });
      });

      it('should not capture unended STR_1, with escaped ending quote', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('\'undended escaped end-quote \\\'');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'STR_1'
        });
      });
    });

    describe('STR_2', () => {
      it('should tokenize STR_2', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"hello world"');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_2',
          lexeme: '"hello world"'
        });
      });

      it('should escape single quotes in STR_2', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"hello \\" world"');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_2',
          lexeme: '"hello \\" world"'
        });
      });

      it('should capture inline COMMENT inside STR_2', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"this is \n // not a comment"');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_2',
          lexeme: '"this is \n // not a comment"'
        });
      });

      it('should capture block COMMENT inside STR_2', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"this is \n /* not a comment*/ "');
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'STR_2',
          lexeme: '"this is \n /* not a comment*/ "'
        });
      });

      it('should not capture unended STR_2', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"undended string');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'STR_2'
        });
      });

      it('should not capture unended STR_2, with escaped ending quote', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('"undended escaped end-quote \\"');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'STR_2'
        });
      });
    });

    describe('FLOAT', () => {
      function recognize (input, message) {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize(input);
        tokens.should.be.an('array').with.lengthOf(1);
        tokens[0].should.include({
          type: 'FLOAT',
          lexeme: input
        }, message);
      }

      it('should tokenize numbers with decimal points as FLOAT', () => {
        recognize('12.213540', 'decimal');
        recognize('-687.05132', 'negative decimal');
        recognize('+24.4454321', 'positive decimal');
      });

      it('should tokenize lowercase scientific notation as FLOAT', () => {
        recognize('1e12', 'scientific');
        recognize('-3e-6', 'negative scientific');
        recognize('+7e+19', 'positive scientific');
        recognize('123.817e19', 'decimal scientific');
      });

      it('should tokenize uppercase scientific notation as FLOAT', () => {
        recognize('1E12', 'scientific');
        recognize('-3E-6', 'negative scientific');
        recognize('+7E+19', 'positive scientific');
        recognize('123.817E19', 'decimal scientific');
      });
    });

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

      it('should not allow opening square brackets in EVENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('[[ not allowed [ ]]');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'EVENT'
        });
      });

      it('should not allow single closing square brackets in EVENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('[[ not allowed ] ]]');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.not.include({
          type: 'EVENT'
        });
      });

      it('should tokenize EVENT before inline COMMENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('[[ // not actually COMMENT\n ]]');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.include({
          type: 'EVENT',
          lexeme: '[[ // not actually COMMENT\n ]]'
        });
      });

      it('should tokenize EVENT before block COMMENT', () => {
        let tokenizer = rainscriptTokenizer();
        let tokens = tokenizer.tokenize('[[ /* not actually COMMENT */ ]]');
        tokens.should.be.an('array').that.is.not.empty;
        tokens[0].should.include({
          type: 'EVENT',
          lexeme: '[[ /* not actually COMMENT */ ]]'
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
