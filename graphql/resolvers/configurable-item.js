

module.exports = {
  Query: {
    getAllConfigurableItem: async (_, __, { db, session }) => {
      let configurableItems = await db.get_all_configurable_item({
        organization_id: session.organization_id
      });
      return configurableItems;
    },

    getConfigurableItem: async (_, { configurable_item_id }, { db, session }) => {
      let configurableItem = await db.get_configurable_item({
        configurable_item_id,
        organization_id: session.organization_id
      });
      return configurableItem[0];
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
