

module.exports = {
  Query: {
     getAllTool: async (_1, _2, db) => {
       let result = await db.get_all_tool({organization_id: 1});
       return result;
     },

     getTool: async (_, { id }, db) => {
       let tool = await db.get_tool({
         id,
         organization_id: 1
       });
       return tool[0];
     }
  },

  Mutation: {
     createTool: async (_, {newTool}, db) => {
       newTool['organization_id'] = 1;
       let result = await db.create_tool(newTool);
       return result[0];
     },

     updateTool: async(_, {tool}, db) => {
       let result = await db.update_tool(tool);
       return result[0];
     }
  }
};
