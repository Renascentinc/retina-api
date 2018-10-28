
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

      for (let i in toolSnapshots) {
        let previousToolSnapshot = toolSnapshots[i-1];
        let toolSnapshot = toolSnapshots[i];

        toolHistoryEntries.push(await createToolHistoryEntry(previousToolSnapshot, toolSnapshot, db));
      }

      return toolHistoryEntries;
    }
  }
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
    console.log(`${currentToolSnapshot.timestamp}`)
    previousToolSnapshot = await db.get_previous_tool_snapshot({
      tool_id: currentToolSnapshot.tool_id,
      timestamp: currentToolSnapshot.timestamp
    });

    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  } else {
    previousToolSnapshotDiff = createPreviousToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot);
  }

  let toolHistoryEntry = {
    timestamp: currentToolSnapshot.timestamp,
    tool_action: currentToolSnapshot.tool_action,
    previous_tool_snapshot_diff: previousToolSnapshotDiff
  }

  currentToolSnapshot['id'] = currentToolSnapshot.tool_id;
  delete currentToolSnapshot.tool_id;
  delete currentToolSnapshot.tool_action;

  toolHistoryEntry['tool_snapshot'] = currentToolSnapshot;

  return toolHistoryEntry;
}
