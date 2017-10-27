import { StringLiteraParser } from '.';

export class LiteralParser {
  /**
   * Decorates a parser with a literal parser.
   * @param {*} parser 
   */
  constructor (parser) {
    // require other parsers
    parser = new StringLiteraParser(parser);
    Object.assign(this, parser || {});
  }
}
