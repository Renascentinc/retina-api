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
  // await testDelete(dbFuncs);

  logger.info('------------------------------------- All DB Tests Passing -------------------------------------');
}

async function testGet(dbFuncs) {
  /// Get organizations
  let expectedNumOrgs = data.organization.length;
  let orgs = await dbFuncs.get_all_organization();
  assert.equal(orgs.length, expectedNumOrgs);

  /// Get organization
  let org = await dbFuncs.get_organization({
    id: dataUtil.getRandIdFromArray(data.organization)
  });
  assert.equal(org.length, 1);

  /// Get configurable items
  let randOrgId = dataUtil.getRandIdFromArray(data.organization);
  let configurableItems = await dbFuncs.get_all_configurable_item({
    organization_id: randOrgId
  });
  let expectedLength = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', randOrgId).length;
  assert.equal(configurableItems.length, expectedLength);

  /// Get configurable item
  let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
  let item = data.configurable_item[itemId - 1];
  let retrievedItem = await dbFuncs.get_configurable_item({
    id: itemId,
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
    id: locationId,
    organization_id: location.organization_id
  });
  assert.equal(retrievedLocation.length, 1);
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
}

async function testUpdate(dbFuncs) {
  /// Update organization
  let newOrgName = "New Organization";
  let updatedOrg = await dbFuncs.update_organization({
    id: dataUtil.getRandIdFromArray(data.organization),
    name: newOrgName
  });

  assert.equal(updatedOrg[0].name, newOrgName);

  /// Update configurable item
  let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
  let item = data.configurable_item[itemId - 1];
  let updatedItem = {
    id: itemId,
    name: 'New Item Name',
    sanctioned: true,
    organization_id: item.organization_id
  };
  let newItem = await dbFuncs.update_configurable_item(updatedItem);

  assert.equal(newItem[0].name, updatedItem.name);
  assert.equal(newItem[0].sanctioned, updatedItem.sanctioned);
}

async function testDelete(dbFuncs) {
  /// Delete configurable item
  let itemId = dataUtil.getRandIdFromArray(data.configurable_item);
  let item = data.configurable_item[itemId-1];
  let deletedItem = await dbFuncs.delete_configurable_item({
    id: itemId,
    organization_id: item.organization_id
  });

  assert.equal(itemId, deletedItem[0].id)
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
