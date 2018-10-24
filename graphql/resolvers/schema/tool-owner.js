
const { ArgumentError } = require(`error`);

module.exports = {
  ToolOwner: {
    __resolveType: async (object, { db }) => {
      if (db.tool_owner_type.fromString(object.type) === db.tool_owner_type.USER) {
        return 'User'
      }

      if (db.tool_owner_type.fromString(object.type) === db.tool_owner_type.LOCATION) {
        return 'Location'
      }

      throw new ArgumentError(`ToolOwner object type ${object.type} is not valid`);
    }
  }
}
