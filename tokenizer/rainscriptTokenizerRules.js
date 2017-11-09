/**
 * The tokenizer rules, ordered by priority. All tokenizer rules go here.
 *
 * tokenizerRules:
 *   {
 *     pattern: RegExp,
 *     type: any,
 *     start: Array<int>?
 *   }[]
 */
export const rainscriptTokenizerRules = [
  // parse quoted string literals
  { pattern: /'(\\.|[^\\'])*'/, type: 'STR_1' },
  { pattern: /"(\\.|[^\\"])*"/, type: 'STR_2' },
  // parse c-style inline and block comments
  { pattern: /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/|\/\/[^\n]*/, type: 'COMMENT' },
  { pattern: /\[\[[^\]]*\]\]/, type: 'EVENT' },
  { pattern: /[a-zA-Z_][0-9a-zA-Z_]*/, type: 'VAR_SUFFIX' },
  { pattern: /\s+/, type: 'WHITESPACE' }
];
