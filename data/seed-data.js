let appConfig = require('../app-config');
let dataUtil = require('../utils/data-utils');

let configurable_items = {
  BRAND: [
    'Bosch',
    'DeWalt',
    'Milwaukee',
    'Makita',
    'Hilti'
  ],
  PURCHASED_FROM: [
    'Lowes',
    'Menards',
    'Home Depot'
  ],
  TYPE: [
    '12v Drill',
    'Sledgehammer',
    'Chainsaw',
    'Sawzall',
    'Hammer',
    'Fuel Pump'
  ]
}

let tool_statuses = [
  'AVAILABLE',
  'IN_USE',
  'MAINTENANCE',
  'BEYOND_REPAIR',
  'LOST_OR_STOLEN'
]

let in_service_tool_statuses = [
  'AVAILABLE',
  'IN_USE',
  'MAINTENANCE'
]

let user_statuses = [
  'ACTIVE',
  'INACTIVE'
]

let roles = [
  'USER',
  'ADMINISTRATOR'
]

let tool_actions = [
  'CREATE',
  'UPDATE',
  'TRANSFER',
  'DECOMISSION',
  'RECOMISSION'
]

let user_info = [
  {
    first_name: 'Josiah',
    last_name: 'Campbell',
    organization_id: 1,
    role: 'ADMINISTRATOR'
  },
  {
    first_name: 'Elias',
    last_name: 'Kraihanzel',
    organization_id: 1,
    role: 'USER'
  },
  {
    first_name: 'Jeremy',
    last_name: 'Brown',
    organization_id: 1,
    role: 'USER'
  },
  {
    first_name: 'Amos',
    last_name: 'Endersen',
    organization_id: 1,
    role: 'USER'
  },
  {
    first_name: 'James',
    last_name: 'Alstrong',
    organization_id: 2,
    role: 'ADMINISTRATOR'
  },
  {
    first_name: 'Nathan',
    last_name: 'Powell',
    organization_id: 2,
    role: 'USER'
  },
  {
    first_name: 'Nathan',
    last_name: 'Powell',
    organization_id: 3,
    role: 'ADMINISTRATOR'
  },
  {
    first_name: 'Henry',
    last_name: 'Hauler',
    organization_id: 3,
    role: 'USER'
  }
];

let data = {};
let metaData = {};

orgConfigs = [
  {
    id: 1,
    name: 'Renascent Inc',
    numTool: appConfig['db.seed.tool.number'],
    numUser: appConfig['db.seed.user.number']
  },
  {
    id: 2,
    name: 'Caterpillar',
    numTool: 50,
    numUser: 5
  },
  {
    id: 3,
    name: 'DeWalt',
    numTool: 50,
    numUser: 5
  }
]

data.organization = [ ];

for (let orgConfig of orgConfigs) {
  data.organization.push({
    name: orgConfig.name
  });
}

data.configurable_item = [ ];

for (var i = 0; i < data.organization.length; i++) {
  for (let configurable_item_type in configurable_items) {
    let configurable_item_type_names = configurable_items[configurable_item_type];
    for (let configurable_item_type_name of configurable_item_type_names) {
      data.configurable_item.push({
        type: configurable_item_type,
        name: configurable_item_type_name,
        sanctioned: true,
        organization_id: i + 1
      })
    }
  }
}

data.location = [
  {
    city: 'Indianapolis',
    state: 'IN',
    zip:  '46225',
    organization_id: 1,
    address_line_one: '935 W. Troy Ave.',
    address_line_two: null,
    name: "The Shop"
  },
  {
    city: 'Bloomington',
    state: 'IN',
    zip:  '28271',
    organization_id: 2,
    address_line_one: '7638 Construction Ln.',
    address_line_two: null,
    name: "ShatterDome"
  },
  {
    city: 'Nashville',
    state: 'TN',
    zip:  '29298',
    organization_id: 3,
    address_line_one: '9183 Working Way',
    address_line_two: 'Greenfield Tower Room 3456',
    name: "HQ"
  }
];

data.user = []

for (let orgConfig of orgConfigs) {
  let orgId = orgConfig.id;
  let orgBaseUserInfo = dataUtil.getFromObjectArrayWhere(user_info, 'organization_id', orgId).objects;

  for (var i = 0; i < orgConfig.numUser; i++) {
    let user = orgBaseUserInfo[i % orgBaseUserInfo.length];
    let userNumber = Math.floor(i / orgBaseUserInfo.length);
    let userFirstName = `${user.first_name}${userNumber || ''}`
    data.user.push({
      first_name: userFirstName,
      last_name: user.last_name,
      email: `${userFirstName.toLowerCase()}@renascentinc.com`,
      phone_number: dataUtil.getRandPhoneNumber(),
      password: 'Test1234!',
      role: user.role,
      status: 'ACTIVE',
      organization_id: user.organization_id
    });
  }
}

// NOTE: It is currently critical that locations come before users in the
//       tool_owner array because that is the order the are added to the `data` object
metaData.tool_owner = [
  ...(data.location.map(location => ({...location, type: 'LOCATION'}))),
  ...(data.user.map(location => ({...location, type: 'USER'})))
];

data.tool = []

for (let orgConfig of orgConfigs) {
  let orgId = orgConfig.id;
  for (var i = 0; i < orgConfig.numTool; i++) {
    let { objects: configurableItems, originalIndecies } = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', orgId);
    data.tool.push({
      type_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(configurableItems, 'type', 'TYPE') - 1] + 1,
      brand_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(configurableItems, 'type', 'BRAND') - 1] + 1,
      purchased_from_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(configurableItems, 'type', 'PURCHASED_FROM') - 1] + 1,
      date_purchased: dataUtil.createRandomDate(),
      model_number: dataUtil.createRandomId(),
      status: dataUtil.getRandFromArray(in_service_tool_statuses),
      serial_number: dataUtil.createRandomId(),
      organization_id: orgId,
      owner_id: dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'organization_id', orgId),
      price: null,
      photo: null,
      year: null,
      tagged: false
    })
  }
}

if (appConfig['environment'] == 'test') {
  data.session = [];

  let { objects: users, originalIndecies } = dataUtil.getFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER')

  users.forEach((user, i) => {
    let originalIndex = originalIndecies[i];
    data.session.push({
      user_id: originalIndex + 1,
      organization_id: metaData.tool_owner[originalIndex].organization_id
    })
  });

}

if (appConfig['environment'] == 'test' || appConfig['environment'] == 'local') {
  data.tool_snapshot = []

  let numToolSnapshot = 100;
  for (var i = 0; i < numToolSnapshot; i++) {
    let randToolId = dataUtil.getRandIdFromArray(data.tool);
    let randTool = data.tool[randToolId - 1];

    let { objects: users, originalIndecies } = dataUtil.getFromObjectArrayWhere(metaData.tool_owner, 'type', 'USER');
    let randUserIndexInOrg = dataUtil.getRandIdFromObjectArrayWhere(users, 'organization_id', randTool.organization_id) - 1;
    let randUserIdInOrg = originalIndecies[randUserIndexInOrg] + 1;
    data.tool_snapshot.push({
      id: dataUtil.normalizeToolId(randToolId),
      ...randTool,
      tool_action: dataUtil.getRandFromArray(tool_actions),
      actor_id: randUserIdInOrg,
      owner_type: metaData.tool_owner[randTool.owner_id - 1].type,
      action_note: "A cool note"
    })
  }
}

module.exports = { data, metaData };
