
module.exports = {
  Query: {
    getOrganization: async (_, __, { db, session: { organization_id } }) => {
      let organization = await db.get_organization({ organization_id });

      return organization[0];
    }
  }
}
