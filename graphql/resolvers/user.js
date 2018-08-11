
module.exports = {
  Query: {
     users: async (_, args, db) => {
       let result = await db.get_users();
       return result;
     }
  }
}
