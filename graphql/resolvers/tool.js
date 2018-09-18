let locationResolvers = require('./location');
let userResolvers = require('./user');
let configurableItemResolvers = require('./configurable-item');

module.exports = {
  Query: {
    getAllTool: async (_, __, { db, session}) => {
      let tools = await db.get_all_tool({
        organization_id: session.organization_id
      });
      return tools;
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
      newTool = await db.create_tool(newTool);
      return newTool[0];
    },

    updateTool: async (_, { updatedTool }, { db, session }) => {
      updatedTool['organization_id'] = session.organization_id;
      updatedTool = await db.update_tool(updatedTool);
      return updatedTool[0];
    }
  },

  Tool: {
    location: async ({ location_id }, _, ctx) => locationResolvers.Query.getLocation(undefined, { location_id }, ctx),
    user: async ({ user_id }, _, ctx) => userResolvers.Query.getUser(undefined, { user_id }, ctx),
    type: async ({ type_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: type_id }, ctx),
    brand: async ({ brand_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: brand_id }, ctx),
    purchased_from: async ({ purchased_from_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: purchased_from_id }, ctx)
  }
};
