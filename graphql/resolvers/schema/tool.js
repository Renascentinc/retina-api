const locationResolvers = require('graphql/resolvers/schema/location');
const userResolvers = require('graphql/resolvers/schema/user');
const configurableItemResolvers = require('graphql/resolvers/schema/configurable-item');
const { preprocessQuery, objectHasTruthyValues, deepEqual } = require(`graphql/utils/data-utils`);
const { ArgumentError } = require(`error`);

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

      db.create_tool_snapshot({
        ...newTool[0],
        tool_action: db.tool_action.CREATE.name
      });

      return newTool[0];
    },

    /**
     * Update tool and only add the tool to tool_snapshot if the
     * updated tool is different than the original tool
     */
    updateTool: async (_, { updatedTool }, { db, session }) => {
      let originalTool = await db.get_tool({
        tool_id: updatedTool.id,
        organization_id: session.organization_id
      });

      updatedTool['organization_id'] = session.organization_id;
      updatedTool = await db.update_tool(updatedTool);

      if (!deepEqual(originalTool[0], updatedTool[0])) {
        db.create_tool_snapshot({
          ...updatedTool[0],
          tool_action: db.tool_action.UPDATE.name
        });
      }

      return updatedTool[0];
    },

    transferMultipleTool: async(_, transferArgs, { db, session }) => {
      transferArgs['organization_id'] = session.organization_id;
      transferArgs['transferrer_id'] = session.user_id;
      let transferredTools = await db.transfer_tool(transferArgs);

      transferredTools.forEach(transferredTool => {
        db.create_tool_snapshot({
          ...transferredTool,
          tool_action: db.tool_action.TRANSFER.name
        });
      });

      return transferredTools;
    }
  },

  Tool: {
    owner: async ({ owner_type, owner_id }, _, ctx) => {

      if (ctx.db.tool_owner_type.fromString(owner_type) === ctx.db.tool_owner_type.USER) {
        return userResolvers.Query.getUser(undefined, { user_id: owner_id }, ctx)
      }

      if (ctx.db.tool_owner_type.fromString(owner_type) === ctx.db.tool_owner_type.LOCATION) {
        return locationResolvers.Query.getLocation(undefined, { location_id: owner_id }, ctx);
      }

      throw new ArgumentError(`Argument 'owner_type' with value ${owner_type} is not a valid owner type`);
    },
    type: async ({ type_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: type_id }, ctx),
    brand: async ({ brand_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: brand_id }, ctx),
    purchased_from: async ({ purchased_from_id }, _, ctx) => configurableItemResolvers.Query.getConfigurableItem(undefined, { configurable_item_id: purchased_from_id }, ctx)
  }
};
