
const { UserInputError } = require('apollo-server');

/**
 * Determine if a user has the given role
 *
 * @param {Object} context - object containing db functions and session information
 * @param {String} role - Role to check
 * @param {Object} db - database object containing functions and database types
 *
 * @returns true - if user role does equals the passed in role
 * @returns false - if user role does not equal the passed in role

 * @throws {UserInputError} - if the user does not exist
 */
async function userHasRole({ organization_id, user_id }, role, db) {
  let user = await db.get_user({ organization_id, user_id });

  if (user.length == 0) {
    throw new UserInputError(`User with id ${user_id} does not exist`);
  }

  return db.role.fromString(user[0].role) === role;
}

module.exports = { userHasRole };
