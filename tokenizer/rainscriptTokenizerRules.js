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
  // floating-point literal
  { pattern: /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/, type: 'FLOAT' },
  // c-style inline and block comments
  { pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/|\/\/[^\n]*/, type: 'COMMENT' },
  // event name
  { pattern: /\[\[[^\]]*\]\]/, type: 'EVENT' },
  { pattern: /[a-zA-Z_][0-9a-zA-Z_]*/, type: 'VAR_SUFFIX' },
  { pattern: /\s+/, type: 'WHITESPACE' }
];
