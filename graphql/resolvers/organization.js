

module.exports = {
  Query: {
    getOrganization: async (_, __, { db, session }) => {
      let organization = await db.get_organization({
        organization_id: session.organization_id
      });

      return organization[0];
    }
  }
}
