

/**
 * Determine if a user has the given role
 *
 * @param {Object} context - context object containing db functions and session information
 * @param {String} role - Role to check
 *
 * @returns true - if user role does equals the passed in role
 * @returns false - if user role does not equal the passed in role

 * @throws {DbError} - if the user does not exist
 */
async function authorizeUser({ db, session: { organization_id, user_id } }, role) {
  let user = await db.get_user({ organization_id, user_id });


  if (user.length == 0) {
    throw new DbError(`User with id ${user_id} does not exist`);
  }

  return user[0].role === role;
}

module.exports = { authorizeUser };
