export const VARIABLE_PREFIX_LOCAL = '.';
export const VARIABLE_PREFIX_PARAM = ':';
export const VARIABLE_PREFIX_GLOBAL = '`';
export const VARIABLE_START = '[a-zA-Z]';
export const VARIABLE_CONTENT = '[a-zA-Z0-9]';
export const VARIABLE_SPLIT = '[.]';
export const VARIABLE_EMBED = '{[' +
  VARIABLE_PREFIX_GLOBAL +
  VARIABLE_PREFIX_LOCAL +
  VARIABLE_PREFIX_PARAM +
  ']' +
  VARIABLE_START +
  VARIABLE_CONTENT + '*' +
  '(?:' +
  VARIABLE_SPLIT +
  VARIABLE_START +
  VARIABLE_CONTENT + '*' +
  ')*}'; // todo: escape embed

export const VARIABLE_START_REGEX = new RegExp(VARIABLE_START);
export const VARIABLE_SPLIT_REGEX = new RegExp(VARIABLE_SPLIT);
export const VARIABLE_CONTENT_REGEX = new RegExp(VARIABLE_CONTENT);
export const VARIABLE_EMBED_REGEX = new RegExp(VARIABLE_EMBED, 'g');
