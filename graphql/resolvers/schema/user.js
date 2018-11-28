
let { preprocessQuery } = require(`graphql/utils/data-utils`);

module.exports = {
  Query: {
    getAllUser: async (_, { pagingParameters = {} }, { db, session }) => {
      pagingParameters['organization_id'] = session.organization_id;
      let users = await db.get_all_user(pagingParameters);
      return users;
    },

    getUser: async (_, { user_id }, { db, session }) => {
      let user = await db.get_user({
        user_id,
        organization_id: session.organization_id
      });
      return user[0];
    },

    searchUser: async (_, { query, pagingParameters: { page_number, page_size } = {} }, { db, session }) => {
      let lexemes = preprocessQuery(query);
      if (lexemes.length == 0) {
        return [];
      }

      let searchResults = await db.search_user({
        lexemes,
        organization_id: session.organization_id,
        page_number,
        page_size
      });
      return searchResults;
    }
  },

  Mutation: {
    createUser: async (_, { newUser }, { db, session }) => {
      newUser['organization_id'] = session.organization_id;
      newUser = await db.create_user(newUser);
      return newUser[0];
    },

    updateUser: async (_, { updatedUser }, { db, session }) => {
      updatedUser['organization_id'] = session.organization_id;
      updatedUser = await db.update_user(updatedUser);
      return updatedUser[0];
    },

    updateCurrentUserPassword: async (_, { current_password, new_password }, { db, session }) => {
      let updatedUser = await db.validated_update_user_password({
        current_password,
        new_password,
        user_id: session.user_id,
        organization_id: session.organization_id
      });
      return updatedUser[0] ? true : false;
    },

    updateUserPassword: async (_, { user_id, new_password }, { db, session }) => {
      let updatedUser = await db.update_user_password({
        user_id,
        new_password,
        organization_id: session.organization_id
      });
      return updatedUser[0] ? true : false;
    },
  }
}
