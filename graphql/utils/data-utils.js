
var TimSort = require('timsort');

/**
 * Preprocess query by
 *   1) Removing extra whitespace
 *   2) Taking it to lowercase
 *   3) Splitting it by ' '
 *   4) Sorting it by word length descending (this is a heuristic based on the
 *      idea that longer words are more rare and therefore will trim down the
 *      query results more quickly)
 *
 * @param {String} query - A query string
 *
 * @returns {Array} - Array of lexemes derived from the string
 * @returns {Array} - Empty array if the query contained no characters
 *
 * Note: Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
 */
function preprocessQuery(query) {
  if (!Boolean(query)) {
    return [];
  }

  let trimmedQuery = query.replace(/\s+/g, " ").trim();
  if (trimmedQuery.length === 0) {
    return [];
  }

  trimmedQuery = trimmedQuery.toLowerCase();

  let lexemes = trimmedQuery.split(' ');
  TimSort.sort(lexemes, (a, b) => b.length - a.length);
  return lexemes;
}

/**
 * Determine if object contains any keys with truthy vlaues
 *
 * @param {Object} object - An object
 *
 * @returns {true} - If object contains keys with truthy values
 * @returns {false} - If object has no keys with truthy values (or object itself is falsey)
 */
function objectHasTruthyValues(object = {}) {
  return Boolean(object) && Object.values(object).some(value => Boolean(value));
}

module.exports = { preprocessQuery, objectHasTruthyValues }
