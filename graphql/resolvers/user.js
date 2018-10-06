
module.exports = {
  Query: {
    getAllUser: async (_, __, { db, session }) => {
      let users = await db.get_all_user({
        organization_id: session.organization_id
      });
      return users;
    },

    getUser: async (_, { user_id }, { db, session }) => {
      let user = await db.get_user({
        user_id,
        organization_id: session.organization_id
      });
      return user[0];
    },

    /**
     * Split query into lexemes (stripping all unneccessary whitespace) and send them
     * to the search_user db function
     *
     * Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
     */
    searchUser: async (_, { query }, { db, session }) => {
      let lexemes = query.replace(/\s+/g, " ").trim().split(' ');
      if (lexemes.length == 0) {
        return [];
      }

      let searchResults = await db.search_user({
        lexemes,
        organization_id: session.organization_id
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

    updatePassword: async (_, { user_id, current_password, new_password }, { db, session }) => {
      let updatedUser = await db.update_password({
        user_id,
        current_password,
        new_password,
        organization_id: session.organization_id
      });
      return updatedUser[0] ? true : false;
    },
  }
}
