

module.exports = {
  Query: {
    getAllConfigurableItem: async (_, { pagingParameters = {} }, { db, session }) => {
      pagingParameters['organization_id'] = session.organization_id;
      let configurableItems = await db.get_all_configurable_item(pagingParameters);
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
    },

    deleteConfigurableItem: async (_, { configurable_item_id }, { db, session }) => {

      let configurableItemIdParameters = {
        configurable_item_id,
        organization_id: session.organization_id
      };

      let toolsWithConfigurableItem = await db.get_all_tool_by_configurable_item_id(configurableItemIdParameters);

      if (toolsWithConfigurableItem.length > 0) {
          return {
            toolsWithConfigurableItem
          }
      }

      deletedConfigurableItem = await db.delete_configurable_item(configurableItemIdParameters);
      deletedConfigurableItem = deletedConfigurableItem[0];

      return {
        deletedConfigurableItem
      }
    }
  }
};
