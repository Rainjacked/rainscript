/**
 * The tokenizer rules, ordered by priority. All tokenizer rules go here.
 *
 * @type {{pattern: RegExp, type: any}[]}
 * @property {RegExp} pattern a regular expression to be matched by a rule
 * @property {*}      type    the type of the next token that will be returned
 *                            when the pattern matches correctly
 */
export const rainscriptTokenizerRules = [
  // quoted string literals
  { pattern: /'(\\.|[^\\'])*'/, type: 'STR_1' },
  { pattern: /"(\\.|[^\\"])*"/, type: 'STR_2' },
  // event name
  { pattern: /\[\[[^\n[\]]*\]\]/, type: 'EVENT' },
  // integer literals
  { pattern: /[-+]?0[0-7]*/, type: 'INT_OCT' },
  { pattern: /[-+]?0(?:b|B)[0-1]*/, type: 'INT_BIN' },
  { pattern: /[-+]?0(?:x|X)[0-9a-fA-F]*/, type: 'INT_HEX' },
  // floating-point literal
  { pattern: /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/, type: 'FLOAT' },
  // c-style inline and block comments
  { pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/|\/\/[^\n]*/, type: 'COMMENT' },
  { pattern: /[a-zA-Z_][0-9a-zA-Z_]*/, type: 'VAR_SUFFIX' },
  { pattern: /\s+/, type: 'WHITESPACE' }
];
