
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { AuthorizationError } = require('error');

module.exports = {
  requiresRole: {

    visitFieldDefinition: async (fieldArgs, { context: { db, session } }, { requiredRole }) =>  {
      let user = await db.get_user({
        user_id: session.user_id,
        organization_id: session.organization_id
      });

      if (db.role.fromString(user[0].role) !== db.role.fromString(requiredRole)) {
        throw new AuthorizationError(`User doesn't have required role ${requiredRole}`);
      }
    }
  }
}
