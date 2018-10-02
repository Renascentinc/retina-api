let locationResolvers = require('./location');
let userResolvers = require('./user');
let configurableItemResolvers = require('./configurable-item');

module.exports = {
  Query: {
    getAllTool: async (_, { pagingParameters = {} }, { db, session}) => {
      pagingParameters['organization_id'] = session.organization_id;
      let tools = await db.get_all_tool(pagingParameters);
      return tools;
    },

    getTool: async (_, { tool_id }, { db, session }) => {
      let tool = await db.get_tool({
        tool_id,
        organization_id: session.organization_id
      });
      return tool[0];
    },

    /**
     * Split query into lexemes (stripping all unneccessary whitespace) and send them
     * to the search_tool db function
     *
     * Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
     */
    searchTool: async (_, { query }, { db, session }) => {
      let lexemes = query.replace(/\s+/g, " ").trim().split(' ');
      if (lexemes.length == 0) {
        return [];
      }

      let searchResults = await db.search_tool({
        lexemes,
        organization_id: session.organization_id
      });
      return searchResults;
    },

    searchStrictTool: async (_, filters, { db, session }) => {
      filters['organization_id'] = session.organization_id;
      let searchResults = await db.search_strict_tool(filters);
      return searchResults;
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
