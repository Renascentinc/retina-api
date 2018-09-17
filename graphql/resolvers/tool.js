

module.exports = {
  Query: {
     getAllTool: async (_, __, { db, session}) => {
       let result = await db.get_all_tool({
         organization_id: session.organization_id
       });
       return result;
     },

     getTool: async (_, { tool_id }, { db, session }) => {
       let tool = await db.get_tool({
         tool_id,
         organization_id: session.organization_id
       });
       return tool[0];
     }
  },

  Mutation: {
     createTool: async (_, { newTool }, { db, session }) => {
       newTool['organization_id'] = session.organization_id;
       let result = await db.create_tool(newTool);
       return result[0];
     },

     updateTool: async(_, { updatedTool }, { db, session }) => {
       updatedTool['organization_id'] = session.organization_id;
       let result = await db.update_tool(updatedTool);
       return result[0];
     }
  }
};
