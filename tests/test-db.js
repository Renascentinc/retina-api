process.env['ENVIRONMENT'] = process.env.ENVIRONMENT || 'test';

const { initializeDb } = require('../db-initializer');
const { data } = require('../data/seed-data');
const dataUtil = require('../utils/data-utils');
const assert = require('assert');
const logger = require('../logger');

async function testDb() {
  logger.info('------------------------------------- Starting DB Tests -------------------------------------');
  let dbFuncs = await initializeDb();
  assert.ok(dbFuncs);
  assert.notEqual(dbFuncs.length, 0);

  await testCreate(dbFuncs);
  await testGet(dbFuncs);
  await testUpdate(dbFuncs);
  await testDelete(dbFuncs);
  await testOtherFunctions(dbFuncs);

  logger.info('------------------------------------- All DB Tests Passing -------------------------------------');
}

async function testCreate(dbFuncs) {
  // Create organization
  let newOrgs = []
  for (let org of data.organization) {
    logger.info("Running create org test");
    newOrgs.push(await dbFuncs.create_organization({dd:org.name}));
  }
  assert.equal(newOrgs.length, data.organization.length);

  // Create configurable item
  let newItems = [];
  for (let item of data.configurable_item) {
    newItems.push(await dbFuncs.create_configurable_item(item));
  }
  assert.equal(newItems.length, data.configurable_item.length);

  /// Create locations
  let newLocations = [];
  for (let location of data.location) {
    newLocations.push(await dbFuncs.create_location(location));
  }
  assert.equal(newLocations.length, data.location.length);

  let newTools = [];
  for (let tool of data.tool) {
    newTools.push(await dbFuncs.create_tool(tool));
  }
  assert.equal(newTools.length, data.tool.length);

  /// Create users
  let newUsers = [];
  for (let user of data.user) {
    newUsers.push(await dbFuncs.create_user(user));
  }
  assert.equal(newUsers.length, data.user.length);

  /// Create sessions
  let newSessions = [];
  for (let session of data.session) {
    newSessions.push(await dbFuncs.create_session(session));
  }
  assert.equal(newSessions.length, data.session.length);
}

async function testGet(dbFuncs) {
  let randOrgId = dataUtil.getRandIdFromArray(data.organization);

  /// Get organizations
  let expectedNumOrgs = data.organization.length;
  let orgs = await dbFuncs.get_all_organization();
  assert.equal(orgs.length, expectedNumOrgs);

  /// Get organization
  let org = await dbFuncs.get_organization({
    organization_id: randOrgId
  });
  assert.equal(org.length, 1);

  /// Get configurable items
  let configurableItems = await dbFuncs.get_all_configurable_item({
    organization_id: randOrgId
  });
  let expectedLength = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', randOrgId).length;
  assert.equal(configurableItems.length, expectedLength);

  /// Get configurable item
  let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
  let item = data.configurable_item[itemId - 1];
  let retrievedItem = await dbFuncs.get_configurable_item({
    configurable_item_id: itemId,
    organization_id: item.organization_id
  });
  assert.equal(retrievedItem.length, 1);

  /// Get locations
  let locations = await dbFuncs.get_all_location({
    organization_id: randOrgId
  });
  expectedLength = dataUtil.getFromObjectArrayWhere(data.location, 'organization_id', randOrgId).length;
  assert.equal(locations.length, expectedLength);

  /// Get location
  let locationId = dataUtil.getRandIdFromArray(data.location);
  let location = data.location[locationId - 1];
  let retrievedLocation = await dbFuncs.get_location({
    location_id: locationId,
    organization_id: location.organization_id
  });
  assert.equal(retrievedLocation.length, 1);

  /// Get tools
  let tools = await dbFuncs.get_all_tool({
    organization_id: randOrgId
  });
  expectedLength = dataUtil.getFromObjectArrayWhere(data.tool, 'organization_id', randOrgId).length;
  assert.equal(tools.length, expectedLength);

  /// Get tool
  let toolId = dataUtil.getRandIdFromArray(data.tool);
  let tool = data.tool[toolId - 1];
  let retrievedTool = await dbFuncs.get_tool({
    tool_id: toolId,
    organization_id: tool.organization_id
  });
  assert.equal(retrievedTool.length, 1);

  /// Get users
  let users = await dbFuncs.get_all_user({
    organization_id: randOrgId
  });
  expectedLength = dataUtil.getFromObjectArrayWhere(data.user, 'organization_id', randOrgId).length;
  assert.equal(users.length, expectedLength);

  // Get user
  let userId = dataUtil.getRandIdFromArray(data.user);
  let user = data.user[userId - 1];
  let retrievedUser = await dbFuncs.get_user({
    user_id: userId,
    organization_id: user.organization_id
  });
  assert.equal(retrievedUser.length, 1);
}

async function testUpdate(dbFuncs) {
  /// Update organization
  let newOrgName = "New Organization";
  let updatedOrg = await dbFuncs.update_organization({
    id: dataUtil.getRandIdFromArray(data.organization),
    name: newOrgName
  });

  assert.equal(updatedOrg.length, 1);
  assert.equal(updatedOrg[0].name, newOrgName);

  /// Update configurable item
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

  // Update tool
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

  // Update User
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

  // Update location
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
}

/*
 * These tests don't currently test that the item is actually deleted but rather
 * that the correct purportedly deleted item is returned
 */
async function testDelete(dbFuncs) {
  /// Delete configurable item
  let newItem = await dbFuncs.create_configurable_item(dataUtil.getRandFromArray(data.configurable_item));
  newItem = newItem[0];
  let deletedItem = await dbFuncs.delete_configurable_item({
    configurable_item_id: newItem.id,
    organization_id: newItem.organization_id
  });

  assert.equal(deletedItem.length, 1);
  assert.equal(newItem.id, deletedItem[0].id);

  /// Delete session
  let newSession = dataUtil.getRandFromArray(data.session);
  newSession['token'] = dataUtil.createRandomId();

  newSession = await dbFuncs.create_session(newSession);
  newSession = newSession[0];
  let deletedSession = await dbFuncs.delete_session(newSession);

  assert.equal(deletedSession.length, 1);
  assert.equal(newSession.token, deletedSession[0].token);
}

async function testOtherFunctions(dbFuncs) {
  /// Session token Exists
  let sessionIndex = dataUtil.getRandIndexFromArray(data.session);
  let session = data.session[sessionIndex];
  let sessionExists = await dbFuncs.session_token_exists({token: session.token});
  assert.equal(sessionExists.length, 1);
  assert.ok(sessionExists[0]);
  assert.ok(sessionExists[0].session_token_exists);

  /// Token does not Exist
  sessionExists = await dbFuncs.session_token_exists({token: dataUtil.createRandomId()});
  assert.ok(sessionExists[0]);
  assert.ok(!sessionExists[0].session_token_exists);

}

(async () => {
  if (process.env.ENVIRONMENT != 'test') {
    logger.info("Skipping DB Test")
    return;
  }

  try {
    await testDb()
  } catch (e) {
    logger.error(`Error while running test`);
    logger.error(e);
    process.exit(1)
  }
  process.exit(0)
})()
