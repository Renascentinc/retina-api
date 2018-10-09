
const { authorizeUser } = require('../utils/authorization-utils');
const { AuthorizationError } = require('../../error');

module.exports = {
  Query: {
    getOrganization: async (_, __, { db, session: { organization_id } }) => {
      let organization = await db.get_organization({ organization_id });

      return organization[0];
    }
  },

  Mutation: {
    createOrganization: async (_, { organization }, context) => {
      if (await authorizeUser(context, 'SUPER_ADMINISTRATOR')) {
        let newOrganization = await context.db.create_organization(organization);
        return newOrganization[0];
      }

      throw new AuthorizationError(`User with id ${context.session.user_id} not allowed to access endpoint createOrganization`);
    }
  }
}
