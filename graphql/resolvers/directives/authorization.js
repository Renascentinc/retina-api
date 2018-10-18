
const { AuthorizationError } = require('error');
const { userHasRole } = require('graphql/utils/authorization-utils');

module.exports = {
  requiresRole: {

    visitFieldDefinition: async (_, { context: { db, session } }, { requiredRole }) =>  {
      if (!userHasRole(session, db.role.fromString(requiredRole), db)) {
        throw new AuthorizationError(`User doesn't have required role ${requiredRole}`);
      }
    }

  }
}
