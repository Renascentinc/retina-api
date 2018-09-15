

module.exports = {
  Query: {
     getAllTool: async (_0, _1, db) => {
       let result = await db.get_all_tool({organization_id: 1});
       return result;
     },

     getTool: async (_, { tool_id }, db) => {
       let tool = await db.get_tool({
         tool_id,
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
