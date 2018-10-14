
const { SchemaDirectiveVisitor } = require('graphql-tools');

module.exports = {
  requiresRole: (fieldArgs, resolverArgs, directiveArgs) => {
    console.log(fieldArgs, resolverArgs, directiveArgs)
  }
}

class RequiresRoleDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    let originalResolver = field.resolve;
    let { requiredRole } = this.args;
    field.resolve = async (...args) => {
      let { db, session: { user_id, organization_id } } = args[2];
      let user = await db.get_user({ user_id, organization_id });
      if (user[0].role !== 'ADMINISTRATOR') {
        throw new Error("waga");
      }

      return await originalResolver.apply(this, args);
    }
  }
}

module.exports = { RequiresRoleDirective }
