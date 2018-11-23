const { Query: locationQueryResolvers } = require('graphql/resolvers/schema/location');
const { Query: userQueryResolvers} = require('graphql/resolvers/schema/user');
const { Tool: toolFieldResolvers } = require('graphql/resolvers/schema/tool');
const { preprocessQuery, objectHasTruthyValues } = require(`graphql/utils/data-utils`);

module.exports = {

  Query: {

    /**
     * Pull out and delete the time_span parameter of toolSnapshotFilter. Then
     * pass in the remaining toolSnapshotFilter (along with time span and other params)
     * to search_strict_tool_snapshot. For each snapshot returned, create a tool history
     * entry based off of the current snapshot and the previous snapshot.
     */
    searchToolSnapshot: async (_, { query = '', toolSnapshotFilter, pagingParameters = {} }, { db, session }) => {

      console.log(query, toolSnapshotFilter, pagingParameters)
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

    tool: toolSnapshot => toolSnapshot,

    metadata: toolSnapshot => {
      toolSnapshot.id = toolSnapshot.tool_id
      return toolSnapshot;
    },

    previous_tool_snapshot: {}
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

// /*
//  * For each key in the current tool snapshot, check to see if the previous tool
//  * snapshot has a different value for that key
//  */
// function createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot) {
//   let previousToolSnapshotDiff = {}
//
//   for (let key in currentToolSnapshot) {
//     if (previousToolSnapshot[key] !== currentToolSnapshot[key]) {
//       previousToolSnapshotDiff[key] = previousToolSnapshot[key];
//     }
//   }
//
//   return previousToolSnapshotDiff
// }
//
// /**
//  * If the previous tool snapshot doesn't exist or the previous snapshot has a
//  * different tool id than the current tool snapshot, then retrieve the current
//  * snapshot's true predecessor snapshot. Create the previous tool snapshot's diff
//  * with the current tool and massage the tool snaphot and diff objects for returning
//  */
// async function createToolHistoryEntry(previousToolSnapshot, currentToolSnapshot, db) {
//   let previousToolSnapshotDiff;
//
//   if (!previousToolSnapshot || previousToolSnapshot.tool_id !== currentToolSnapshot.tool_id) {
//     previousToolSnapshot = await db.≥/({
//       tool_id: currentToolSnapshot.tool_id,
//       timestamp: currentToolSnapshot.timestamp
//     });
//
//     previousToolSnapshot = previousToolSnapshot[0] || {};
//
//     previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
//   } else {
//     previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
//   }
//
//   let toolSnapshot = { ...currentToolSnapshot };
//   toolSnapshot['id'] = toolSnapshot.tool_id;
//
//   previousToolSnapshotDiff['id'] = currentToolSnapshot.tool_id;
//   previousToolSnapshotDiff['owner_type'] = previousToolSnapshot.owner_type;
//
//   let toolHistoryEntryMetadata = {
//     timestamp: toolSnapshot.timestamp,
//     tool_action: toolSnapshot.tool_action,
//     action_note: toolSnapshot.action_note,
//     actor_id: toolSnapshot.actor_id
//   }
//
//   let toolHistoryEntry = {
//     id: currentToolSnapshot.id,
//     tool_snapshot: toolSnapshot,
//     previous_tool_snapshot_diff: previousToolSnapshotDiff,
//     metadata: toolHistoryEntryMetadata,
//   }
//
//   return toolHistoryEntry;
// }
