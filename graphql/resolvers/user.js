
module.exports = {
  Query: {
     getAllUser: async (_, __, db) => {
       let result = await db.get_users();
       return result;
     }
  },

  Mutation: {
    createUser: async (_, { newUser }, { db, session }) => {
      newUser['organization_id'] = session.organization_id;
      let createdUser = await db.create_user(newUser);
      return createdUser[0];
    }
  }
}
