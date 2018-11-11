const assert = require('assert');

const { initializeDb } = require('db-initializer');
const { dbClient } = require('db-client');
const { data, metaData } = require('data/seed-data');
const dataUtil = require('utils/data-utils');
const appConfig = require('app-config');
const { getPostgresDbRawClient } = require('utils/db-utils');
const logger = require('logger');

async function dropDbIfExists(dbName) {
  let postgresClient = getPostgresDbRawClient();
  await postgresClient.connect();
  await postgresClient.query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
      AND pid <> pg_backend_pid();
  `);

  logger.info(`Dropping database (if it exists)`)
  await postgresClient.query(`DROP DATABASE IF EXISTS ${dbName};`);
  await postgresClient.end();
}

describe('Database creation and usage', async () => {
  // This is initialized in describe('db-initializer.initializeDb()')
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

  describe('create_user()', () => {

    it('successfully creates several users', async () => {
      let newUsers = [];
      for (let user of data.user) {
        newUsers.push(await dbFuncs.create_user(user));
      }
      assert.equal(newUsers.length, data.user.length);
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

  describe('create_tool_snapshot()', () => {

    it('successfully creates a tool snapshot', async () => {
      let randUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randUser = metaData.tool_owner[randUserId - 1];

      let toolId = dataUtil.getRandIdFromObjectArrayWhere(data.tool, 'owner_id', randUserId);

      let tool = await dbFuncs.get_tool({
        tool_id: toolId,
        organization_id: randUser.organization_id
      });

      tool = tool[0];
      tool['status'] = 'LOST_OR_STOLEN';

      let toolSnapshot = await dbFuncs.create_tool_snapshot(
      {
        ...tool,
        tool_action: dbFuncs.tool_action.UPDATE.name,
        actor_id: tool.owner_id,
        out_of_service_reason: "The tool was stolen by Billy the Kid"
      });

      assert.equal(toolSnapshot.length, 1);
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

  describe('create_password_reset_credentials()', () => {

    it('successfully creates password reset credentials', async () => {
      let randUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randUser = metaData.tool_owner[randUserId - 1];
      let passwordResetCredentials = await dbFuncs.create_password_reset_credentials({
        user_id: randUserId,
        organization_id: randUser.organization_id
      })
      assert.equal(passwordResetCredentials.length, 1);
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
      let locationId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'LOCATION');
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
      let expectedNumTools = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId
      });

      assert.equal(tools.length, expectedNumTools);
    });

    it('successfully gets a page of tools', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let pageSize = 5;
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId,
        page_size: pageSize,
        page_number: 0
      });

      assert.equal(tools.length, pageSize);
    });

    it('gets 0 tools for an out-of-range page', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId,
        page_size: 5,
        page_number: 100000
      });

      assert.equal(tools.length, 0);
    });

    it('successfully gets all tools when page size is not specified', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedNumTools = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId,
        page_number: 10
      });

      assert.equal(tools.length, expectedNumTools);
    });

    it('successfully gets page of tools when no page is specified', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let pageSize = 5;
      let tools = await dbFuncs.get_all_tool({
        organization_id: randOrgId,
        page_size: pageSize,
      });

      assert.equal(tools.length, pageSize);
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
      let userId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let user = metaData.tool_owner[userId - 1];
      let retrievedUser = await dbFuncs.get_user({
        user_id: userId,
        organization_id: user.organization_id
      });
      assert.equal(retrievedUser.length, 1);
    });

  });

  describe('get_password_reset_credentials_by_code()', () => {

    it('successfully retrieves password reset credentials by code', async () => {
      let randUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randUser = metaData.tool_owner[randUserId - 1];
      let passwordResetCredentials = await dbFuncs.create_password_reset_credentials({
        user_id: randUserId,
        organization_id: randUser.organization_id
      });
      passwordResetCredentials = passwordResetCredentials[0];

      let retrievedPasswordResetCredentials = await dbFuncs.get_password_reset_credentials_by_code({
        password_reset_code: passwordResetCredentials.code
      });

      assert.equal(retrievedPasswordResetCredentials.length, 1);

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

  describe('get_user_by_credentials_and_organization()', () => {

    it('a user can be retrieved, given their email, password, and org id', async () => {
      let randomUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randomUser = metaData.tool_owner[randomUserId - 1];
      let validUser = await dbFuncs.get_user_by_credentials_and_organization({
        email: randomUser.email,
        password: randomUser.password,
        organization_id: randomUser.organization_id
      });

      assert.equal(validUser.length, 1);
      assert.equal(validUser[0].id, randomUserId);
    });

  });

  describe('get_user_by_credentials()', () => {

    it('at least one user can be retrieved, given their email and password', async () => {
      let randomUserId = dataUtil.getRandIdFromArray(data.user);
      let randomUser = data.user[randomUserId - 1];
      let validUser = await dbFuncs.get_user_by_credentials({
        email: randomUser.email,
        password: randomUser.password
      });

      assert.ok(validUser.length > 0);
    });

  });

  describe('get_user_by_email()', () => {

    it('at least one user can be retrieved, given their email', async () => {
      let randomUserId = dataUtil.getRandIdFromArray(data.user);
      let randomUser = data.user[randomUserId - 1];
      let validUser = await dbFuncs.get_user_by_email({
        email: randomUser.email
      });

      assert.ok(validUser.length > 0);
    });

  });

  describe('get_user_by_email_and_organization()', () => {

    it('at least one user can be retrieved, given their email and organization', async () => {
      let randomUserId = dataUtil.getRandIdFromArray(data.user);
      let randomUser = data.user[randomUserId - 1];
      let validUser = await dbFuncs.get_user_by_email_and_organization({
        email: randomUser.email,
        organization_id: randomUser.organization_id
      });

      assert.ok(validUser.length > 0);
    });

  });

  describe('get_session_by_token()', () => {

    it('successfully gets an existing session by token', async () => {
      let randSession = dataUtil.getRandFromArray(data.session);
      let session = await dbFuncs.get_session_by_user_id({
        user_id: randSession.user_id
      });
      session = session[0];

      let sessionFromToken = await dbFuncs.get_session_by_token({token: session.token});
      assert.equal(sessionFromToken.length, 1);
      assert.equal(sessionFromToken[0].user_id, session.user_id);
    });


    it('fails to get a token does not exist', async () => {
      session = await dbFuncs.get_session_by_token({token: dataUtil.createRandomUuid()});
      assert.equal(session.length, 0);
    });

  });

  describe('get_session_by_user_id()', () => {

    it('a session can be retrieved by user id', async () => {
      let existingSession = await dbFuncs.get_session_by_user_id({
        user_id: dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER')
      });

      assert.ok(existingSession.length >= 1);
    });

  });

  describe('get_all_tool_by_configurable_item_id()', () => {

    it('tools can be retrieved by configurable item id', async () => {
      let randTool = dataUtil.getRandFromArray(data.tool);

      let randomConfigurableItemIdType = dataUtil.getRandFromArray(['brand_id', 'type_id', 'purchased_from_id']);
      let randomConfigurableItemId = randTool[randomConfigurableItemIdType];
      let randomConfigurableItem = data.configurable_item[randomConfigurableItemId - 1];

      let tools = await dbFuncs.get_all_tool_by_configurable_item_id({
        configurable_item_id: randomConfigurableItemId,
        organization_id: randomConfigurableItem.organization_id
      });

      assert.ok(tools.length > 0);
    });

  });


  describe('search_fuzzy_tool()', () => {

    it('successfully searches for tools', async () => {
      let randomTool = dataUtil.getRandFromArray(data.tool);
      let tools = await dbFuncs.search_fuzzy_tool({
        lexemes: [randomTool.serial_number],
        organization_id: randomTool.organization_id
      });

      assert.ok(tools.length > 0);
    });

    it('returns all tools when lexemes is empty', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedToolArrayLength = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.search_fuzzy_tool({
        lexemes: [],
        organization_id: randOrgId
      });

      assert.equal(tools.length, expectedToolArrayLength)
    });

  });

  describe('search_user()', () => {

    it('successfully searches for users', async () => {
      let randomUser = dataUtil.getRandFromArray(data.user);
      let users = await dbFuncs.search_user({
        lexemes: [randomUser.first_name],
        organization_id: randomUser.organization_id
      });

      assert.ok(users.length > 0);
    });

  });

  describe('search_strict_tool()', () => {

    it('successfully searches for tools when only some filters are passed', async () => {
      let randomTool = dataUtil.getRandFromArray(data.tool);
      let tools = await dbFuncs.search_strict_tool({
        owner_ids: [randomTool.owner_id],
        type_ids: undefined,
        organization_id: randomTool.organization_id
      });

      assert.ok(tools.length > 0);
    });

    it('successfully searches for tools when all filters are passed', async () => {
      let randomToolId = dataUtil.getRandIdFromArray(data.tool);
      let randomTool = data.tool[randomToolId - 1];
      let randomToolFromDb = await dbFuncs.get_tool({
        tool_id: randomToolId,
        organization_id: randomTool.organization_id
      });

      randomToolFromDb = randomToolFromDb[0];

      let tools = await dbFuncs.search_strict_tool({
        owner_ids: [randomToolFromDb.owner_id],
        type_ids: [randomToolFromDb.type_id],
        brand_ids: [randomToolFromDb.brand_id],
        tool_statuses: [randomToolFromDb.status],
        organization_id: randomToolFromDb.organization_id
      });

      assert.ok(tools.length > 0);
    });

    it('returns all tools if no filters are passed', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedToolArrayLength = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.search_strict_tool({
        organization_id: randOrgId
      });

      assert.equal(tools.length, expectedToolArrayLength);
    });

    /// To verify that a type_id is being searched on that doesn't exist in the db, search
    /// for an id that is 1 greater than the greatest id in the db
    it('returns no tools for a query with no filters that match existing tools', async () => {
      let tools = await dbFuncs.search_strict_tool({
        type_ids: [data.configurable_item.length + 1],
        organization_id: dataUtil.getRandIdFromArray(data.organization)
      });

      assert.equal(tools.length, 0);
    });

    it('ignores filters that are empty arrays', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let expectedLength = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).objects.length;
      let tools = await dbFuncs.search_strict_tool({
        owner_ids: [],
        organization_id: randOrgId
      });

      assert.equal(tools.length, expectedLength);
    });

  });

  describe('search_fuzzy_ids_tool()', () => {

    it('successfully searches for tools based on the ids given', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let { objects: toolArray, originalIndecies } = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId);
      let tools = await dbFuncs.search_fuzzy_ids_tool({
        lexemes: [dataUtil.getRandFromArray(toolArray).serial_number],
        tool_ids: originalIndecies.map(index => index + 1)
      });

      assert.ok(tools.length > 0);
    });

    it('returns no tools if tool_ids is empty', async () => {
      let randomTool = dataUtil.getRandFromArray(data.tool);
      let tools = await dbFuncs.search_fuzzy_ids_tool({
        lexemes: [randomTool.serial_number],
        tool_ids: []
      });

      assert.equal(tools, 0)
    });

    it('returns all given tools when lexemes is empty', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let toolIndecies = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).originalIndecies;
      let tools = await dbFuncs.search_fuzzy_ids_tool({
        lexemes: [],
        tool_ids: toolIndecies.map(index => index + 1)
      });

      assert.equal(tools.length, toolIndecies.length)
    });

  });

  describe('search_strict_fuzzy_tool()', () => {

    it('successfully searches for tools when both lexemes and filters are passed', async () => {
      let randTool = dataUtil.getRandFromArray(data.tool);
      let tools = await dbFuncs.search_strict_fuzzy_tool({
        organization_id: randTool.organization_id,
        lexemes: [randTool.serial_number],
        brand_ids: [randTool.brand_id]
      });

      assert.ok(tools.length > 0);
    });

  });

  describe('search_strict_tool_snapshot()', () => {

    it.skip('successfully searches for tool snapshots', async () => {

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
          photo: 'photoUrl'
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
      let userId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let user = metaData.tool_owner[userId - 1];
      delete user['type'];
      user['id'] = userId;
      let updatedUserObject = {...user,
        ...{
          phone_number: '1234567890',
          status: 'ACTIVE'
        }
      };
      delete updatedUserObject.password;
      let updatedUser = await dbFuncs.update_user(updatedUserObject);

      assert.equal(updatedUser.length, 1);
      assert.equal(updatedUser[0].role, updatedUserObject.role);
      assert.equal(updatedUser[0].status, updatedUserObject.status);
    });

  });

  describe('update_location()', () => {

    it('successfully updates a location for an organization', async () => {
      let locationId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'LOCATION');
      let location = metaData.tool_owner[locationId - 1];
      delete location['type'];
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

  describe('update_password()', () => {

    it(`successfully updates a user's password`, async () => {
      let newPassword = "New Password";

      let randomUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randomUser = metaData.tool_owner[randomUserId - 1];
      let updatedUser = await dbFuncs.update_password({
        user_id: randomUserId,
        organization_id: randomUser.organization_id,
        current_password: randomUser.password,
        new_password: newPassword
      });

      assert.equal(updatedUser.length, 1);

      let validUser = await dbFuncs.get_user_by_credentials_and_organization({
        email: randomUser.email,
        password: newPassword,
        organization_id: randomUser.organization_id
      });

      assert.equal(validUser.length, 1);
      assert.equal(validUser[0].id, randomUserId);
    });

    it(`does not update a user's password if the wrong current password is given`, async () => {
      let wontBeSetNewPassword = "Won't Be Set New Password";

      let randomUserId = dataUtil.getRandIdFromArray(data.user);
      let randomUser = data.user[randomUserId - 1];
      let updatedUser = await dbFuncs.update_password({
        user_id: randomUserId,
        organization_id: randomUser.organization_id,
        current_password: "Wrong Password",
        new_password: wontBeSetNewPassword
      });

      assert.equal(updatedUser.length, 0);

      let validUser = await dbFuncs.get_user_by_credentials_and_organization({
        email: randomUser.email,
        password: wontBeSetNewPassword,
        organization_id: randomUser.organization_id
      });

      assert.equal(validUser.length, 0);
    });

  });

  describe('update_user_password_by_id()', () => {

    it(`successfully updates a user's password, given user id and organization id`, async () => {
      let userId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let user = metaData.tool_owner[userId - 1];
      let newPassword = "NewPassword";

      let updatedUser = await dbFuncs.update_user_password_by_id({
        organization_id: user.organization_id,
        user_id: userId,
        new_password: newPassword
      });

      updatedUser = updatedUser[0];

      let waja = {
        email: updatedUser.email,
        password: newPassword,
        organization_id: updatedUser.organization_id
      }
      let authenticatedUser = await dbFuncs.get_user_by_credentials_and_organization(waja);

      assert.equal(authenticatedUser.length, 1);
    });

  });

  describe('transfer_tool()', () => {

    /**
     * First ensure that a tool has a user owner with a known id. Then
     * have that user transfer the tool to a different user
     */
    it('successfully transfers a tool', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let allUsers = await dbFuncs.get_all_user({ organization_id: randOrgId });
      let allTools = await dbFuncs.get_all_tool({ organization_id: randOrgId });

      let randTool = dataUtil.getRandFromArray(allTools);
      let toolOwnerId = allUsers.pop().id;
      randTool.owner_id = toolOwnerId

      delete randTool.owner_type;
      await dbFuncs.update_tool(randTool);

      let newToolOwnerId = dataUtil.getRandFromArray(allUsers).id;

      let transferredTools = await dbFuncs.transfer_tool({
        organization_id: randOrgId,
        tool_id_list: [randTool.id],
        transferrer_id: toolOwnerId,
        to_owner_id: newToolOwnerId
      });

      assert.ok(transferredTools.length > 0);
    });

    /**
     * First ensure that a tool has a user owner with a known id. Then
     * have that user transfer the tool to a different location
     */
    it('successfully transfers a tool to a location', async () => {
      let randOrgId = dataUtil.getRandIdFromArray(data.organization);
      let allUsers = await dbFuncs.get_all_user({ organization_id: randOrgId });
      let allTools = await dbFuncs.get_all_tool({ organization_id: randOrgId });

      let randTool = dataUtil.getRandFromArray(allTools);
      let toolOwnerId = allUsers.pop().id;
      randTool.owner_id = toolOwnerId

      delete randTool.owner_type;
      await dbFuncs.update_tool(randTool);

      let newLocationId = dataUtil.getRandIdFromObjectArrayWhere(data.location, 'organization_id', randOrgId);

      let transferredTools = await dbFuncs.transfer_tool({
        organization_id: randOrgId,
        tool_id_list: [randTool.id],
        transferrer_id: toolOwnerId,
        to_owner_id: newLocationId
      });

      assert.ok(transferredTools.length > 0);
    });

    it.skip(`doesn't transfer a tool a user doesn't own`, async () => {

    });

  });

  describe('delete_configurable_item()', () => {

    it('successfully deletes a location for an organization', async () => {
      let newItem = await dbFuncs.create_configurable_item({
        type: 'BRAND',
        name: 'A New Brand',
        sanctioned: true,
        organization_id: dataUtil.getRandIdFromArray(data.organization)
      });
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
      let randSession = dataUtil.getRandFromArray(data.session);
      let session = await dbFuncs.get_session_by_user_id({
        user_id: randSession.user_id
      });
      session = session[0];

      let deletedSession = await dbFuncs.delete_session({
        token: session.token
      });

      assert.equal(deletedSession.length, 1);
      assert.equal(session.token, deletedSession[0].token);
    });

  });

  describe('delete_password_reset_credentials()', () => {

    it('successfully deletes password reset credentials', async () => {
      let randUserId = dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
      let randUser = metaData.tool_owner[randUserId - 1];
      let passwordResetCredentials = await dbFuncs.create_password_reset_credentials({
        user_id: randUserId,
        organization_id: randUser.organization_id
      });
      passwordResetCredentials = passwordResetCredentials[0];

      let deletedPasswordResetCredentials = await dbFuncs.delete_password_reset_credentials({
        user_id: passwordResetCredentials.user_id,
        organization_id: passwordResetCredentials.organization_id
      });

      assert.equal(deletedPasswordResetCredentials.length, 1);
    });

  });

  describe('db enum creation', () => {

    it('successfully creates the enums', async () => {
      assert.ok(dbFuncs.role &&
                dbFuncs.role.USER &&
                dbFuncs.role.USER.name === 'USER');

      assert.ok(dbFuncs.tool_status &&
                dbFuncs.tool_status.IN_USE &&
                dbFuncs.tool_status.IN_USE.name === 'IN_USE');

      assert.ok(dbFuncs.configurable_item_type &&
                dbFuncs.configurable_item_type.BRAND &&
                dbFuncs.configurable_item_type.BRAND.name === 'BRAND');

      assert.ok(dbFuncs.user_status &&
                dbFuncs.user_status.INACTIVE &&
                dbFuncs.user_status.INACTIVE.name === 'INACTIVE')
    });

  });

  after(async () => {
    await dbClient.disconnect();
    // await dropDbIfExists(appConfig['db.database']);
  })
});
