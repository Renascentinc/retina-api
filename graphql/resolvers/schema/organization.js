
const { userHasRole } = require('graphql/utils/authorization-utils');
const { AuthorizationError, DbError } = require('error');

module.exports = {
  Query: {
    getOrganization: async (_, __, { db, session: { organization_id } }) => {
      let organization = await db.get_organization({ organization_id });

      return organization[0];
    }
  },

  Mutation: {
    createOrganization: async (_, { newOrganization, firstUser }, { db, session: { organization_id, user_id } }) => {
      let user = await db.get_user({
        user_id,
        organization_id
      });

      if (await userHasRole(user[0], db.role.SUPER_ADMINISTRATOR)) {
        isValidFirstUser(firstUser);

        newOrganization = await db.create_organization(newOrganization);
        newOrganization = newOrganization[0];

        firstUser = await db.create_user({
          ...firstUser,
          organization_id: newOrganization.id
        });

        firstUser = firstUser[0];

        return {
          newOrganization,
          firstUser
        }
      }

      throw new AuthorizationError(`User with id ${session.user_id} not allowed to access endpoint createOrganization`);
    }
  }
}
