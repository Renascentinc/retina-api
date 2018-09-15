

module.exports = {
  Query: {
     getAllConfigurableItem: async (_, x, db) => {
       let result = await db.get_all_configurable_item({organization_id: 1});
       return result;
     }
  }
};
