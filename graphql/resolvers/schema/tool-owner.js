
const { ArgumentError } = require(`error`);

module.exports = {
  ToolOwner: {
    __resolveType: async (object, { db }) => {
      if (db.owner_type.fromString(object.type) === db.owner_type.USER) {
        return 'User'
      }

      if (db.owner_type.fromString(object.type) === db.owner_type.LOCATION) {
        return 'Location'
      }

      throw new ArgumentError(`Owner object type ${object.type} is not valid`);
    }
  }
}
