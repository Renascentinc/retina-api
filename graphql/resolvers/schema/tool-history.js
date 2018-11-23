const { Query: locationQueryResolvers } = require('graphql/resolvers/schema/location');
const { Query: userQueryResolvers} = require('graphql/resolvers/schema/user');
const { Tool: toolFieldResolvers } = require('graphql/resolvers/schema/tool');
const { preprocessQuery, objectHasTruthyValues } = require(`graphql/utils/data-utils`);

module.exports = {

  Query: {

    getToolSnapshot: async (_, { tool_snapshot_id }, { db, session }) => {
      let toolSnapshot = await db.get_tool_snapshot({
        tool_snapshot_id,
        organization_id: session.organization_id
      });
      return toolSnapshot[0];
    },

    /**
     * Split query into lexemes (stripping all unneccessary whitespace) and send them
     * to the search_xxxx_tool_snapshot db functions
     *
     * 1) If there are no lexems, just use filters
     * 2) If there are lexemes, but no filters, return fuzzy search
     * 3) If there are both lexemes and filters, use both
     * Whitespace removal regex found at https://stackoverflow.com/questions/2898192/how-to-remove-extra-white-spaces-using-javascript-or-jquery
     */
    searchToolSnapshot: async (_, { query = '', toolSnapshotFilter, pagingParameters = {} }, { db, session }) => {

      let baseFunctionParams = {
        organization_id: session.organization_id,
        ...pagingParameters
      };

      toolSnapshotFilter = normalizeToolSnapshotFilter(toolSnapshotFilter);

      let lexemes = preprocessQuery(query);

      if (lexemes.length == 0) {
        return await db.search_strict_tool_snapshot({ ...baseFunctionParams, ...toolSnapshotFilter });
      }

      if (!objectHasTruthyValues(toolSnapshotFilter)) {
        return await db.search_fuzzy_tool_snapshot({ ...baseFunctionParams, lexemes });
      }

      return await db.search_strict_fuzzy_tool_snapshot({ ...baseFunctionParams, lexemes, ...toolSnapshotFilter });
    }
  },

  ToolSnapshot: {

    metadata: toolSnapshot => toolSnapshot,

    tool: toolSnapshot => {
      toolSnapshot.id = toolSnapshot.tool_id
      return toolSnapshot;
    },

    previous_tool_snapshot: async ({ previous_tool_snapshot_id, organization_id }, _, { db }) => {
      let previousToolSnapshot = await db.get_tool_snapshot({
        tool_snapshot_id: previous_tool_snapshot_id,
        organization_id
      });
      return previousToolSnapshot[0];
    }

  },

  ToolSnapshotMetadata: {

    actor: async ({ actor_id }, _, ctx) => {
      return userQueryResolvers.getUser(undefined, { user_id: actor_id }, ctx)
    }

  }

}

/*
 * Pull the children of the time span object up be first class citizens
 */
function normalizeToolSnapshotFilter(toolSnapshotFilter) {
  if (toolSnapshotFilter) {
    let normalizedToolSnapshotFilter = {
      ...toolSnapshotFilter,
      ...toolSnapshotFilter.time_span
    };
    delete normalizedToolSnapshotFilter.time_span;
    return normalizedToolSnapshotFilter;
  }
}
