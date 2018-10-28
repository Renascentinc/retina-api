const { Tool: ToolFieldResolvers } = require('graphql/resolvers/schema/tool');

module.exports = {
  Query: {
    searchToolHistory: async (_, { toolHistoryFilter, pagingParameters = {} }, { db, session }) => {
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

  PreviousToolSnapshotDiff: ToolFieldResolvers
}

function createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot) {
  let previousToolSnapshotDiff = {}

  for (let key in currentToolSnapshot) {
    if (previousToolSnapshot[key] !== currentToolSnapshot[key]) {
      previousToolSnapshotDiff[key] = previousToolSnapshot[key];
    }
  }

  return previousToolSnapshotDiff
}

async function createToolHistoryEntry(previousToolSnapshot, currentToolSnapshot, db) {
  let previousToolSnapshotDiff;

  if (!previousToolSnapshot || previousToolSnapshot.tool_id !== currentToolSnapshot.tool_id) {
    previousToolSnapshot = await db.get_previous_tool_snapshot({
      tool_id: currentToolSnapshot.tool_id,
      timestamp: currentToolSnapshot.timestamp
    });

    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  } else {
    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  }

  let toolSnapshot = { ...currentToolSnapshot };
  toolSnapshot['id'] = toolSnapshot.tool_id;

  let toolHistoryEntry = {
    timestamp: toolSnapshot.timestamp,
    tool_action: toolSnapshot.tool_action,
    previous_tool_snapshot_diff: previousToolSnapshotDiff,
    tool_snapshot: toolSnapshot
  }

  return toolHistoryEntry;
}
