const assert = require('assert');

const { initializeDb } = require('../db-initializer');
const { dbClient } = require('../db-client');
const { data } = require('../data/seed-data');
const dataUtil = require('../utils/data-utils');
const appConfig = require('../app-config');
const { getPostgresDbRawClient } = require('../utils/db-utils');
const logger = require('../logger');

async function dropDbIfExists(dbName) {
  let postgresClient = getPostgresDbRawClient();
  await postgresClient.connect();
  await postgresClient.query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
      AND pid <> pg_backend_pid();
  `);

  logger.info(`Dropping database`)
  await postgresClient.query(`DROP DATABASE ${dbName};`);
  await postgresClient.end();
}

describe('Database creation and usage', async () => {
  let dbFuncs;

  before(async () => {
    await dropDbIfExists(appConfig['db.database']);
  });

  describe('db-initializer.initializeDb()', () => {

    it('successfully creates database and functions', async () => {
      dbFuncs = await initializeDb();
      assert.ok(dbFuncs);
      assert.ok(Object.keys(dbFuncs).length > 0);
    });

  });

  describe('create_organization()', () => {

    it('successfully creates several organizations', async () => {
      let newOrgs = []
      for (let org of data.organization) {
        newOrgs.push(await dbFuncs.create_organization(org));
      }
      assert.equal(newOrgs.length, data.organization.length);
    });

  });

  describe('create_configurable_item()', () => {

    it('successfully creates several configurable items', async () => {
      let newItems = [];
      for (let item of data.configurable_item) {
        newItems.push(await dbFuncs.create_configurable_item(item));
      }
      assert.equal(newItems.length, data.configurable_item.length);
    });

  });

  describe('create_location()', () => {

    it('successfully creates several locations', async () => {
        let newLocations = [];
        for (let location of data.location) {
          newLocations.push(await dbFuncs.create_location(location));
        }
        assert.equal(newLocations.length, data.location.length);
    });

  });

  describe('create_tool()', () => {

    it('successfully creates several tools', async () => {
      let newTools = [];
      for (let tool of data.tool) {
        newTools.push(await dbFuncs.create_tool(tool));
      }
      assert.equal(newTools.length, data.tool.length);
    });

  });

  describe('create_user()', () => {

    it('successfully creates several users', async () => {
      let newUsers = [];
      for (let user of data.user) {
        newUsers.push(await dbFuncs.create_user(user));
      }
      assert.equal(newUsers.length, data.user.length);
    });

  });

  describe('create_session()', () => {

    it('successfully creates several sessions', async () => {
      let newSessions = [];
      for (let session of data.session) {
        newSessions.push(await dbFuncs.create_session(session));
      }
      assert.equal(newSessions.length, data.session.length);
    });

  });

  describe('get_all_organization()', () => {

    it('successfully gets all organizations', async () => {
      let expectedNumOrgs = data.organization.length;
      let orgs = await dbFuncs.get_all_organization();
      assert.equal(orgs.length, expectedNumOrgs);
    });

  });

  describe('get_organization()', () => {

    it('successfully gets an organization', async () => {
      let org = await dbFuncs.get_organization({
        organization_id: dataUtil.getRandIdFromArray(data.organization)
      });
      assert.equal(org.length, 1);
    });

  });

  describe('get_all_configurable_item()', () => {

    it('successfully gets all configurable items for an organization', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedNumItems = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', randOrgId).objects.length;

      let configurableItems = await dbFuncs.get_all_configurable_item({
        organization_id: randOrgId
      });
      assert.equal(configurableItems.length, expectedNumItems);
    });

  });

  describe('get_configurable_item ()', () => {

    it('successfully gets a configurable item', async () => {
      let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
      let item = data.configurable_item[itemId - 1];
      let retrievedItem = await dbFuncs.get_configurable_item({
        configurable_item_id: itemId,
        organization_id: item.organization_id
      });
      assert.equal(retrievedItem.length, 1);
    });

  });

  describe('get_all_location()', () => {

    it('successfully gets all locations for an organization', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedNumLocations = dataUtil.getFromObjectArrayWhere(data.location, 'organization_id', randOrgId).objects.length;
      let locations = await dbFuncs.get_all_location({
        organization_id: randOrgId
      });

      assert.equal(locations.length, expectedNumLocations);
    });

  });

  describe('get_location()', () => {

    it('successfully gets a location', async () => {
      let locationId = dataUtil.getRandIdFromArray(data.location);
      let location = data.location[locationId - 1];
      let retrievedLocation = await dbFuncs.get_location({
        location_id: locationId,
        organization_id: location.organization_id
      });
      assert.equal(retrievedLocation.length, 1);
    });

  });

  describe('get_all_tool()', () => {

    it('successfully gets all tools for an organization', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedNumTools= dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId
      });

      assert.equal(tools.length, expectedNumTools);
    });

  });

  describe('get_tool()', () => {

    it('successfully gets a tool', async () => {
      let toolId = dataUtil.getRandIdFromArray(data.tool);
      let tool = data.tool[toolId - 1];
      let retrievedTool = await dbFuncs.get_tool({
        tool_id: toolId,
        organization_id: tool.organization_id
      });
      assert.equal(retrievedTool.length, 1);
    });

  });

  describe('get_all_user()', () => {

    it('successfully gets all users for an organization', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedLength = dataUtil.getFromObjectArrayWhere(data.user, 'organization_id', randOrgId).objects.length;
      let users = await dbFuncs.get_all_user({
        organization_id: randOrgId
      });
      assert.equal(users.length, expectedLength);
    });

  });

  describe('get_user()', () => {

    it('successfully gets a user', async () => {
      let userId = dataUtil.getRandIdFromArray(data.user);
      let user = data.user[userId - 1];
      let retrievedUser = await dbFuncs.get_user({
        user_id: userId,
        organization_id: user.organization_id
      });
      assert.equal(retrievedUser.length, 1);
    });

  });

  describe('update_organization()', () => {

    it('successfully updates an organization', async () => {
      let newOrgName = "New Organization";
      let updatedOrg = await dbFuncs.update_organization({
        id: dataUtil.getRandIdFromArray(data.organization),
        name: newOrgName
      });
      assert.equal(updatedOrg.length, 1);
      assert.equal(updatedOrg[0].name, newOrgName);
    });

  });

  describe('update_configurable_item()', () => {

    it('successfully updates a configurable item for an organization', async () => {
      let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
      let item = data.configurable_item[itemId - 1];
      let updatedItemObject = {
        id: itemId,
        name: 'New Item Name',
        sanctioned: true,
        organization_id: item.organization_id
      };
      let updatedItem = await dbFuncs.update_configurable_item(updatedItemObject);

      assert.equal(updatedItem.length, 1);
      assert.equal(updatedItem[0].name, updatedItemObject.name);
      assert.equal(updatedItem[0].sanctioned, updatedItemObject.sanctioned);
    });

  });

  describe('update_tool()', () => {

    it('successfully updates a tool for an organization', async () => {
      let toolId = dataUtil.getRandIdFromArray(data.tool);
      let tool = data.tool[toolId - 1];
      tool['id'] = toolId;
      let updatedToolObject = {...tool,
        ...{
          model_number: dataUtil.createRandomId(),
          status: 'OUT_OF_SERVICE'
        }
      };
      let updatedTool = await dbFuncs.update_tool(updatedToolObject);

      assert.equal(updatedTool.length, 1);
      assert.equal(updatedTool[0].model_number, updatedToolObject.model_number);
      assert.equal(updatedTool[0].status, updatedToolObject.status);
    });

  });

  describe('update_user()', () => {

    it('successfully updates a user for an organization', async () => {
      let userId = dataUtil.getRandIdFromArray(data.user);
      let user = data.user[userId - 1];
      user['id'] = userId;
      let updatedUserObject = {...user,
        ...{
          role: 'ADMINISTRATOR',
          status: 'ACTIVE'
        }
      };
      let updatedUser = await dbFuncs.update_user(updatedUserObject);

      assert.equal(updatedUser.length, 1);
      assert.equal(updatedUser[0].role, updatedUserObject.role);
      assert.equal(updatedUser[0].status, updatedUserObject.status);
    });

  });

  describe('update_location()', () => {

    it('successfully updates a location for an organization', async () => {
      let locationId = dataUtil.getRandIdFromArray(data.location);
      let location = data.location[locationId - 1];
      location['id'] = locationId;
      let updatedLocationObject = {...location,
        ...{
          state: 'NY',
          name: 'New Location'
        }
      };
      let updatedLocation = await dbFuncs.update_location(updatedLocationObject);

      assert.equal(updatedLocation.length, 1);
      assert.equal(updatedLocation[0].state, updatedLocationObject.state);
      assert.equal(updatedLocation[0].name, updatedLocationObject.name);
    });

  });

  describe('delete_configurable_item()', () => {

    it('successfully deletes a location for an organization', async () => {
      let newItem = await dbFuncs.create_configurable_item(dataUtil.getRandFromArray(data.configurable_item));
      newItem = newItem[0];
      let deletedItem = await dbFuncs.delete_configurable_item({
        configurable_item_id: newItem.id,
        organization_id: newItem.organization_id
      });

      assert.equal(deletedItem.length, 1);
      assert.equal(newItem.id, deletedItem[0].id);
    });

  });

  describe('delete_session()', () => {

    it('successfully deletes a session', async () => {
      let newSession = dataUtil.getRandFromArray(data.session);
      newSession = await dbFuncs.create_session(newSession);
      newSession = newSession[0];

      let deletedSession = await dbFuncs.delete_session({
        token: newSession.token
      });

      assert.equal(deletedSession.length, 1);
      assert.equal(newSession.token, deletedSession[0].token);
    });

  });

  describe('get_session_by_token()', () => {

    it('successfully gets an existing token', async () => {
      let newSession = dataUtil.getRandFromArray(data.session);
      newSession = await dbFuncs.create_session(newSession);
      newSession = newSession[0];

      let session = await dbFuncs.get_session_by_token({token: newSession.token});
      assert.equal(session.length, 1);
      assert.equal(session[0].user_id, newSession.user_id);
    });


    it('fails to get a token does not exist', async () => {
      session = await dbFuncs.get_session_by_token({token: dataUtil.createRandomUuid()});
      assert.equal(session.length, 0);
    });

  });

  describe('get_session_by_user_id()', () => {

    it('a session can be retrieved by user id', async () => {
      let existingSession = await dbFuncs.get_session_by_user_id({
        user_id: dataUtil.getRandIdFromArray(data.user)
      });

      assert.ok(existingSession.length >= 1);
    });

  });

  describe('get_organization_by_name()', () => {

    it('an organization can be retrieved by name', async () => {
      let newOrganization = await dbFuncs.create_organization(
      {
        name: dataUtil.createRandomUuid()
      });

      newOrganization = newOrganization[0];

      let organization = await dbFuncs.get_organization_by_name({
        organization_name: newOrganization.name
      });
      assert.equal(organization.length, 1);
      assert.equal(organization[0].id, newOrganization.id);
    });

  });

  describe('get_user_by_credentials()', () => {

    it('a user can be retrieved, given their email, password, and org id', async () => {
      let randomUserId = dataUtil.getRandIdFromArray(data.user);
      let randomUser = data.user[randomUserId - 1];
      let validUser = await dbFuncs.get_user_by_credentials({
        email: randomUser.email,
        password: randomUser.password,
        organization_id: randomUser.organization_id
      });

      assert.equal(validUser.length, 1);
      assert.equal(validUser[0].id, randomUserId);
    });

  });

  after(async () => {
    await dbClient.disconnect()
  })
});
