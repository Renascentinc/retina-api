process.env['ENVIRONMENT'] = 'test';

const { initializeDb } = require('../db-initializer');
const { data } = require('../data/seed-data');
const dataUtil = require('../utils/data-utils');
const assert = require('assert');
async function testDb() {
  let dbFuncs = await initializeDb();

  await testCreate(dbFuncs);
  await testGet(dbFuncs);
  await testUpdate(dbFuncs);
}

async function testGet(dbFuncs) {
  /// Get organizations
  let expectedNumOrgs = data.organization.length;
  let orgs = await dbFuncs.get_all_organization();
  assert.equal(orgs.length, expectedNumOrgs);

  /// Get organization
  let org = await dbFuncs.get_organization({ id: dataUtil.getRandIndexFromArray(data.organization)});
  assert.equal(org.length, 1);

  /// Get configurable items
  let randOrgId = dataUtil.getRandIndexFromArray(data.organization);
  let configurableItems = await dbFuncs.get_all_configurable_item({
    organization_id: randOrgId
  });
  let expectedLength = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', randOrgId).length;
  assert.equal(configurableItems.length, expectedLength, "Failed to get configurable items");

  /// Get configurable item
  let item = await dbFuncs.get_configurable_item({ id: dataUtil.getRandIndexFromArray(data.configurable_item)});
  assert.equal(org.length, 1);
}

async function testCreate(dbFuncs) {
  for (let org of data.organization) {
    await dbFuncs.create_organization(org);
  }

  for (let item of data.configurable_item) {
    await dbFuncs.create_configurable_item(item);
  }
}

async function testUpdate(dbFuncs) {
  /// Update organization
  dbFuncs.update_organization({
    id: dataUtil.getRandIndexFromArray(data.organization),
    name: "New Organization"
  })
}

(async () => {
  try {
    await testDb()
  } catch (e) {
    console.log(`Error while running test`);
    console.log(e);
    process.exit(1)
  }
  process.exit(0)
})()
