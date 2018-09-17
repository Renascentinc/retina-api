
module.exports = {
  Query: {
    getAllUser: async (_, __, { db, session }) => {
      let result = await db.get_all_user({
        organization_id: session.organization_id
      });
      return result;
    },

    getUser: async (_, { user_id }, { db, session }) => {
      let result = await db.get_user({
        user_id,
        organization_id: session.organization_id
      });
      return result[0];
    }
  },

  Mutation: {
    createUser: async (_, { newUser }, { db, session }) => {
      newUser['organization_id'] = session.organization_id;
      let createdUser = await db.create_user(newUser);
      return createdUser[0];
    },

    updateUser: async (_, { updatedUser }, { db, session }) => {
      updatedUser['organization_id'] = session.organization_id;
      updatedUser = await db.update_user(updatedUser);
      return updatedUser[0];
    }
  }
}
