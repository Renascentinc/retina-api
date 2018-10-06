let locationResolvers = require('./location');
let userResolvers = require('./user');
let configurableItemResolvers = require('./configurable-item');
let { preprocessQuery, objectHasTruthyValues } = require('../utils/data-utils');

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
     * 1) If there are no lexems, just use filters
     * 2) If there are lexemes, but no filters, return
     * 3) If there are bot
     * Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
     */
    searchTool: async (_, { query = '', toolFilter, pagingParameters = {} }, { db, session }) => {
      let functionParams = {
        organization_id: session.organization_id,
        ...pagingParameters
      };

      let lexemes = preprocessQuery(query);

      if (lexemes.length == 0) {
        return await db.search_strict_tool({ ...functionParams, ...toolFilter });
      }

      if (!objectHasTruthyValues(toolFilter)) {
        return await db.search_fuzzy_tool({ ...functionParams, lexemes });
      }

      return await db.search_strict_fuzzy_tool({ ...functionParams, lexemes, ...toolFilter });
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
