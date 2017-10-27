import { StringLiteraParser, IntegerLiteralParser } from '.';

export class LiteralParser {
  /**
   * Decorates a parser with a literal parser.
   * @param {*} parser 
   */
  constructor (parser) {
    // require other parsers
    parser = new StringLiteraParser(parser);
    parser = new IntegerLiteralParser(parser);
    Object.assign(this, parser);
  }
}
