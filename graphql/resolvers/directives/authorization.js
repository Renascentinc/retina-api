
const { AuthorizationError } = require('error');
const { userHasRole } = require('graphql/utils/authorization-utils');

module.exports = {
  requiresRole: {

    visitFieldDefinition: async (fieldInfo, { context: { db, session } }, { requiredRole }) =>  {
      let userAuthorized = await userHasRole(session, db.role.fromString(requiredRole), db);
      if (!userAuthorized) {
        throw new AuthorizationError(`User doesn't have required role ${requiredRole} for field ${fieldInfo.fieldDetails.objectType}::${fieldInfo.field.name}`);
      }
    }

  }
}
