import Lexer from 'lex';
import { _ } from 'lodash';
import { rainscriptTokenizerRules } from './rainscriptTokenizerRules';

const ccount = require('ccount');

// the regex-based lexer for the Rainscript tokenizer
let _lexer = new Lexer(token(null));

// grab rules from tokenizerRules file
rainscriptTokenizerRules.forEach(rule =>
  _lexer.addRule(rule.pattern, token(rule.type), rule.start)
);

/**
 * A factory method that creates a new Rainscript tokenizer instance.
 * @returns an instance of Rainscript's tokenizer
 */
export const rainscriptTokenizer = () => {
  // wrap lexer prototype so that tokenizers can be thread-safe
  let lexer = Object.create(_lexer);

  return {
    /**
     * Collects all tokens of an input text. Also collects metadata information
     * such as the line number and column index of the parsed token.
     * @param {String} text the text to parse tokens from
     * @return {{type: any, lexeme: String, line: int, column: int}}
     */
    tokenize (text) {
      if (!_.isString(text)) {
        throw new TypeError('tokenize only accepts a String');
      }
      lexer.setInput(text);
      let line = 1;
      let column = 1;
      let token;
      let tokens = [];
      while (!_.isUndefined(token = lexer.lex())) {
        // append the new token, along with the line number
        tokens.push(Object.assign(token, {
          line: line,
          column: column
        }));
        // update line / column numbers
        let lexeme = token.lexeme;
        let lines = ccount(lexeme, '\n');
        if (lines > 0) {
          line += lines;
          column = lexeme.length - lexeme.lastIndexOf('\n');
        } else {
          column += lexeme.length;
        }
      }
      return tokens;
    }
  };
};

/**
 * Wraps a token into a callback function for lex.
 * @param {*} type the type of the token to wrap
 * @return {Function} a function that creates a lexeme with the token's type
 */
function token (type) {
  return lexeme => {
    return {
      type: type,
      lexeme: lexeme
    };
  };
}
