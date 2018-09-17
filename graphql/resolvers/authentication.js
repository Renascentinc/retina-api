
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
  Mutation: {
    login: async (_, { organization_name, email, password }, { db }) => {
      let organization = await db.get_organization_by_name({
        organization_name
      });

      if (organization.length < 1) {
        throw new UserInputError(`Organization "${organization_name}" does not exist`);
      }

      organization = organization[0];

      let user = await db.get_user_by_credentials({
        organization_id: organization.id,
        email,
        password
      });

      if (user.length < 1) {
        throw new AuthenticationError(`Authentication failed`);
      }

      user = user[0];

      let existingSession = await db.get_session_by_user_id({
        user_id: user.id
      });

      if (existingSession.length > 0) {
        return {
          token: existingSession[0].token,
          user: user
        }
      }

      let newSession = await db.create_session({
        organization_id: organization.id,
        user_id: user.id
      });

      if (newSession.length < 1) {
        throw new ApolloError(`Failed to create user session`, 'SESSION_CREATION_ERROR');
      }

      return {
        token: newSession[0].token,
        user: user
      }
    },

    logout: async (_, __, { db, session }) => {
      let deletedToken = await db.delete_session({ token: session.token });
      return deletedToken[0] ? true : false;
    }
  }
};
