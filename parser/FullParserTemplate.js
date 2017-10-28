/**
 * This is the template for Rainscript's full parser. This template is
 * instantiated only once (singleton const), and creates the parser part by
 * part.
 */

import { BaseParser } from './base/BaseParser';
import { DirectiveParser } from './directive/DirectiveParser';
import { InputDirectiveParser } from './directive/InputDirectiveParser';
import { PrintDirectiveParser } from './directive/PrintDirectiveParser';
import { ChoiceDirectiveParser } from './directive/ChoiceDirectiveParser';
import { ConditionalDirectiveParser } from './directive/ConditionalDirectiveParser';
import { EventParser } from './event/EventParser';
import { ExpressionParser } from './expression/ExpressionParser';
import { ArgumentExpressionParser } from './expression/ArgumentExpressionParser';
import { SliceExpressionParser } from './expression/SliceExpressionParser';
import { TypedExpressionParser } from './expression/TypedExpressionParser';
import { AtomicParser } from './literal/AtomicParser';
import { FlagLiteralParser } from './literal/FlagLiteralParser';
import { IntegerLiteralParser } from './literal/IntegerLiteralParser';
import { StringLiteralParser } from './literal/StringLiteralParser';
import { StatementParser, SpeechParser } from './statement/SpeechParser';
import { VariableParser } from './variable/VariableParser';
import { TranspilerOutputFormat } from './TranspilerOutputFormat';

const include = [
  // base
  BaseParser,
  // directive
  DirectiveParser,
  ChoiceDirectiveParser,
  ConditionalDirectiveParser,
  InputDirectiveParser,
  PrintDirectiveParser,
  // event
  EventParser,
  // expression
  ExpressionParser,
  ArgumentExpressionParser,
  SliceExpressionParser,
  TypedExpressionParser,
  // literal
  AtomicParser,
  FlagLiteralParser,
  IntegerLiteralParser,
  StringLiteralParser,
  // statement
  StatementParser,
  SpeechParser,
  // variable
  VariableParser
];

export const FullParserTemplate = class FullParserTemplate {
  constructor () {
    // include transpiler format
    let transpilerFormat = new TranspilerOutputFormat();
    this.transpilerFormat = () => transpilerFormat; // getter
    // register the parsers from include
    let self = this;
    include.forEach(Parser => {
      Object.assign(self, new Parser());
    });
  }
};
