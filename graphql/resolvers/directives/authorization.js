
const { SchemaDirectiveVisitor } = require('graphql-tools');

module.exports = {
  requiresRole: {

    visitFieldDefinition: async (fieldArgs, { context: { db, session } }, { requiredRole }) =>  {
      let user = await db.get_user({
        user_id: session.user_id,
        organization_id: session.organization_id
      });

      if (user[0].role !== requiredRole) {
        throw new Error("waga");
      }
    }
  }
}
