
module.exports = {
  Query: {
    getAllLocation: async (_, __, { db, session }) => {
      let locations = await db.get_all_location({
        organization_id: session.organization_id
      });
      return locations;
    },

    getLocation: async (_, { location_id }, { db, session }) => {
      let location = await db.get_location({
        location_id,
        organization_id: session.organization_id
      });
      return location[0];
    }
  },

  Mutation: {
    createLocation: async (_, { newLocation }, { db, session }) => {
      newLocation['organization_id'] = session.organization_id;
      newLocation = await db.create_location(newLocation);
      return newLocation[0];
    },

    updateLocation: async (_, { updatedLocation }, { db, session }) => {
      updatedLocation['organization_id'] = session.organization_id;
      updatedLocation = await db.update_location(updatedLocation);
      return updatedLocation[0];
    }
  }
}
