



module.exports = {
  Mutation: {
    login: async (_, { organization_name, username, password }, db) => {
      let token = await db.create_token({
        token: 'jofajiwe232309',
        user_id: 3,
        organization_id: 1
      });
      console.log(token)
      return token[0];
    },

    logout: async (_, { token }, db) => {
      let deletedToken = await db.delete_token(token);
      return deletedToken[0] ? true : false;
    }
  }
};
