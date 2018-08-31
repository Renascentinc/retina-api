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
    newOrgs.push(await dbFuncs.create_organization(org));
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

  /// Create tokens
  let newTokens = [];
  for (let token of data.token) {
    newTokens.push(await dbFuncs.create_token(token));
  }
  assert.equal(newTokens.length, data.token.length);
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
    organization_id: dataUtil.getRandIdFromArray(data.organization),
    name: newOrgName
  });

  assert.equal(updatedOrg.length, 1);
  assert.equal(updatedOrg[0].name, newOrgName);

  /// Update configurable item
  let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
  let item = data.configurable_item[itemId - 1];
  let updatedItemObject = {
    configurable_item_id: itemId,
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
  tool['tool_id'] = toolId;
  delete tool.id;
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
  user['user_id'] = userId;
  delete user.id;
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

  /// Delete token
  let newToken = dataUtil.getRandFromArray(data.token);
  newToken['token'] = dataUtil.createRandomId();

  newToken = await dbFuncs.create_token(newToken);
  newToken = newToken[0];
  let deletedToken = await dbFuncs.delete_token(newToken);

  assert.equal(deletedToken.length, 1);
  assert.equal(newToken.token, deletedToken[0].token);
}

async function testOtherFunctions(dbFuncs) {
  /// Token Exists
  let tokenIndex = dataUtil.getRandIndexFromArray(data.token);
  let token = data.token[tokenIndex];
  let tokenExists = await dbFuncs.token_exists(token);
  assert.equal(tokenExists.length, 1);
  assert.ok(tokenExists[0]);
  assert.ok(tokenExists[0].token_exists);

  /// Token does not Exist
  token['user_id'] = 100000;
  tokenExists = await dbFuncs.token_exists(token);
  assert.equal(tokenExists.length, 1);
  assert.ok(tokenExists[0]);
  assert.ok(!tokenExists[0].token_exists);
}

(async () => {
  if (process.env.ENVIRONMENT != 'test') {
    logger.info("Skipping DB Test")
    return;
  }

  try {
    await testDb()
  } catch (e) {
    console.log(`Error while running test`);
    console.log(e);
    process.exit(1)
  }
  process.exit(0)
})()
