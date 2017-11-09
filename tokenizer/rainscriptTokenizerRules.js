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
  { pattern: /\[\[[^\]]*\]\]/, type: 'EVENT' },
  { pattern: /[a-zA-Z_][0-9a-zA-Z_]*/, type: 'VAR_SUFFIX' },
  { pattern: /\s+/, type: 'WHITESPACE' }
];
