

module.exports = {
  Query: {
    getAllConfigurableItem: async (_, __, { db, session }) => {
      let result = await db.get_all_configurable_item({
        organization_id: session.organization_id
      });
      return result;
    },

    getConfigurableItem: async (_, { configurable_item_id }, { db, session }) => {
      let result = await db.get_configurable_item({
        configurable_item_id,
        organization_id: session.organization_id
      });
      return result[0];
    }
  },

  Mutation: {
    createConfigurableItem: async (_, { newConfigurableItem }, { db, session }) => {
      newConfigurableItem['organization_id'] = session.organization_id;
      newConfigurableItem = await db.create_configurable_item(newConfigurableItem);
      return newConfigurableItem[0];
    },

    updateConfigurableItem: async (_, { updatedConfigurableItem }, { db, session }) => {
      updatedConfigurableItem['organization_id'] = session.organization_id;
      updatedConfigurableItem = await db.update_configurable_item(updatedConfigurableItem);
      return updatedConfigurableItem[0];
    }
  }
};
