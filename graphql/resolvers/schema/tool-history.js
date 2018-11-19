const { Query: locationQueryResolvers } = require('graphql/resolvers/schema/location');
const { Query: userQueryResolvers} = require('graphql/resolvers/schema/user');
const { Tool: toolFieldResolvers } = require('graphql/resolvers/schema/tool');

module.exports = {

  Query: {

    /**
     * Pull out and delete the time_span parameter of toolHistoryFilter. Then
     * pass in the remaining toolHistoryFilter (along with time span and other params)
     * to search_strict_tool_snapshot. For each snapshot returned, create a tool history
     * entry based off of the current snapshot and the previous snapshot.
     */
    searchToolHistoryEntry: async (_, { toolHistoryFilter = {}, pagingParameters = {} }, { db, session }) => {
      let timeSpan = toolHistoryFilter.time_span;
      delete toolHistoryFilter.time_span;

      let filterParams = {
        organization_id: session.organization_id,
        ...timeSpan,
        ...toolHistoryFilter,
        ...pagingParameters
      }

      let toolSnapshots = await db.search_strict_tool_snapshot(filterParams);

      let toolHistoryEntries = []

      // This indexing assumes that toolSnapshots are ordered by id and then timestamp
      for (let i in toolSnapshots) {
        let previousToolSnapshot = toolSnapshots[i-1];
        let toolSnapshot = toolSnapshots[i];

        toolHistoryEntries.push(await createToolHistoryEntry(previousToolSnapshot, toolSnapshot, db));
      }

      return toolHistoryEntries;
    }
  },

  PreviousToolSnapshotDiff: {

    /*
     * First check for a valid owner type and query for that owner. If the owner type
     * is not valid, it is possible that the previous tool snapshot diff had no owner
     * so if there is no owner id, return null. Else, throw an ArgumentError.
     */
    owner: async ({ owner_type, owner_id }, _, ctx) => {

      if (ctx.db.tool_owner_type.fromString(owner_type) === ctx.db.tool_owner_type.USER) {
        return userQueryResolvers.getUser(undefined, { user_id: owner_id }, ctx)
      }

      if (ctx.db.tool_owner_type.fromString(owner_type) === ctx.db.tool_owner_type.LOCATION) {
        return locationQueryResolvers.getLocation(undefined, { location_id: owner_id }, ctx);
      }

      if (!Boolean(owner_id)) {
        return null;
      }

      throw new ArgumentError(`Argument 'owner_type' with value ${owner_type} is not a valid owner type`);
    },
    type: toolFieldResolvers.type,
    brand: toolFieldResolvers.brand,
    purchased_from: toolFieldResolvers.purchased_from

  },

  ToolHistoryEntryMetadata: {

    actor: async ({ actor_id }, _, ctx) => {
      return userQueryResolvers.getUser(undefined, { user_id: actor_id }, ctx)
    }

  }

}

/*
 * For each key in the current tool snapshot, check to see if the previous tool
 * snapshot has a different value for that key
 */
function createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot) {
  let previousToolSnapshotDiff = {}

  for (let key in currentToolSnapshot) {
    if (previousToolSnapshot[key] !== currentToolSnapshot[key]) {
      previousToolSnapshotDiff[key] = previousToolSnapshot[key];
    }
  }

  return previousToolSnapshotDiff
}

/**
 * If the previous tool snapshot doesn't exist or the previous snapshot has a
 * different tool id than the current tool snapshot, then retrieve the current
 * snapshot's true predecessor snapshot. Create the previous tool snapshot's diff
 * with the current tool and massage the tool snaphot and diff objects for returning
 */
async function createToolHistoryEntry(previousToolSnapshot, currentToolSnapshot, db) {
  let previousToolSnapshotDiff;

  if (!previousToolSnapshot || previousToolSnapshot.tool_id !== currentToolSnapshot.tool_id) {
    previousToolSnapshot = await db.get_previous_tool_snapshot({
      tool_id: currentToolSnapshot.tool_id,
      timestamp: currentToolSnapshot.timestamp
    });

    previousToolSnapshot = previousToolSnapshot[0] || {};

    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  } else {
    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  }

  let toolSnapshot = { ...currentToolSnapshot };
  toolSnapshot['id'] = toolSnapshot.tool_id;

  previousToolSnapshotDiff['id'] = currentToolSnapshot.tool_id;
  previousToolSnapshotDiff['owner_type'] = previousToolSnapshot.owner_type;

  let toolHistoryEntryMetadata = {
    timestamp: toolSnapshot.timestamp,
    tool_action: toolSnapshot.tool_action,
    action_note: toolSnapshot.action_note,
    actor_id: toolSnapshot.actor_id
  }

  let toolHistoryEntry = {
    id: currentToolSnapshot.id,
    tool_snapshot: toolSnapshot,
    previous_tool_snapshot_diff: previousToolSnapshotDiff,
    metadata: toolHistoryEntryMetadata,
  }

  return toolHistoryEntry;
}
