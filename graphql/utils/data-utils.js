
var TimSort = require('timsort');

/**
 * Preprocess query by
 *   1) Removing extra whitespace
 *   2) Taking it to lowercase
 *   3) Splitting it by ' '
 *   4) Sorting it by word length descending
 *
 * @param {String} query - A query string
 *
 * @returns {Array} - Array of lexemes derived from the string
 * @returns {Array} - Empty array if the query contained no characters
 *
 * Note: Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
 */
function preprocessQuery(query) {
  let trimmedQuery = query.replace(/\s+/g, " ").trim();
  if (trimmedQuery.length === 0) {
    return [];
  }

  trimmedQuery = trimmedQuery.toLowerCase();

  let lexemes = trimmedQuery.split(' ');
  TimSort.sort(lexemes, (a, b) => b.length - a.length);
  return lexemes;
}

module.exports = { preprocessQuery }
