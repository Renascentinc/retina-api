
const { ArgumentError } = require(`error`);

module.exports = {
  ToolOwner: {
    __resolveType: async (toolOwner, { db }) => {
      if (db.tool_owner_type.fromString(toolOwner.type) === db.tool_owner_type.USER) {
        return 'User'
      }

      if (db.tool_owner_type.fromString(toolOwner.type) === db.tool_owner_type.LOCATION) {
        return 'Location'
      }

      throw new ArgumentError(`ToolOwner object type ${toolOwner.type} is not valid`);
    }
  }
}
