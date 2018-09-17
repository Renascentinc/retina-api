
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
    }
  }
}
