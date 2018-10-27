
module.exports = {
  Query: {
    searchToolHistory: async (_, { toolHistoryFilter, pagingParameters = {} }, { db, session }) => {
      let timeSpan = toolHistoryFilter.time_span;
      delete toolHistoryFilter.time_span;

      let filterParams = {
        organization_id: session.organization_id,
        ...timeSpan,
        ...toolHistoryFilter
      }

      console.log(filterParams)
      // let toolSnapshots = await db.search_strict_tool_snapshot();
    }
  }
}
