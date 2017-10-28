/**
 * Removes inline and block C-style comments from a string.
 */
export const CommentsRemover = (() => {
  /**
   * Returns a new string without block and inline comments.
   * @param {String} string
   */
  function all (string) {
    return block(inline(string));
  }

  /**
   * Returns a new string without inline comments.
   * @param {String} string 
   */
  function inline (string) {
    // note how we are not using regular expressions for this,
    // for the reason that we want to avoid removing double-slashes
    // in quoted string literals.
    let length = string.length;
    let quote = null;
    let buffer = '';
    for (let i = 0; i < length; ++i) {
      let c = string[i];
      if (c === '\\') {
        // escape next character
        ++i;
      } else if (quote !== null) {
        if (c === quote) {
          // close quote
          quote = null;
        }
      } else if (c === '\'' || c === '"') {
        // start quote
        quote = c;
      } else if (c === '/' && i + 1 < length && string[i + 1] === '/') {
        i += 2;
        while (i < length && string[i] !== '\n') {
          ++i;
        }
        --i;
        continue;
      }
      buffer += c;
    }
    return buffer;
  }

  /**
   * Returns a new string without block comments.
   * @param {String} string 
   */
  function block (string) {
    // note how we are not using regular expressions for this,
    // for the reason that we want to avoid removing block comments
    // in quoted string literals. Also, we want to keep the newlines intact.
    let length = string.length;
    let quote = null;
    let buffer = '';
    for (let i = 0; i < length; ++i) {
      let c = string[i];
      if (c === '\\') {
        // escape next character
        ++i;
      } else if (quote !== null) {
        if (c === quote) {
          // close quote
          quote = null;
        }
      } else if (c === '\'' || c === '"') {
        // start quote
        quote = c;
      } else if (c === '/' && i + 1 < length && string[i + 1] === '*') {
        i += 2;
        while (i < length && string.slice(i, i + 2) !== '*/') {
          ++i;
        }
        --i;
        continue;
      }
      buffer += c;
    }
    return buffer;
  }

  return {
    all: all,
    inline: inline,
    block: block
  };
})();
