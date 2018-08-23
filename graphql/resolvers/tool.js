

module.exports = {
  Query: {
     tools: async (_, args, db) => {
       let result = await db.get_tools();
       return result;
     }
  },

  Mutation: {
     addTool: async (_, {tool}, db) => {
       let result = await db.add_tool(tool);
       return result[0];
     },

     updateTool: async(_, {tool}, db) => {
       let result = await db.update_tool(tool);
       return result[0];
     }
  }
};
