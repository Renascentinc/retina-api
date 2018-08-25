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
  let item = await dbFuncs.get_configurable_item({
    id: dataUtil.getRandIdFromArray(data.configurable_item)
  });
  assert.equal(org.length, 1);
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
