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
     * Pull out and delete the time_span parameter of toolSnapshotFilter. Then
     * pass in the remaining toolSnapshotFilter (along with time span and other params)
     * to search_strict_tool_snapshot. For each snapshot returned, create a tool history
     * entry based off of the current snapshot and the previous snapshot.
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

      if (!objectHasTruthyValues(toolFilter)) {
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

function normalizeToolSnapshotFilter(toolSnapshotFilter) {
  if (toolSnapshotFilter) {
    let normalizedToolHistoryFilter = {
      ...toolSnapshotFilter,
      ...toolSnapshotFilter.time_span
    };
    delete normalizedToolSnapshotFilter.time_span;
    return normalizedToolSnapshotFilter;
  }
}
