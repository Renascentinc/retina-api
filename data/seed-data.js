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
  'OUT_OF_SERVICE'
]

let user_statuses = [
  'ACTIVE',
  'INACTIVE'
]

let roles = [
  'USER',
  'ADMINISTRATOR'
]

let user_info = [
  {
    first_name: 'Josiah',
    last_name: 'Campbell',
    organization_id: 1
  },
  {
    first_name: 'Elias',
    last_name: 'Kraihanzel',
    organization_id: 1
  },
  {
    first_name: 'Jeremy',
    last_name: 'Brown',
    organization_id: 1
  },
  {
    first_name: 'Amos',
    last_name: 'Endersen',
    organization_id: 1
  },
  {
    first_name: 'James',
    last_name: 'Alstrong',
    organization_id: 2
  },
  {
    first_name: 'Nathan',
    last_name: 'Powell',
    organization_id: 1
  },
  {
    first_name: 'Nathan',
    last_name: 'Powell',
    organization_id: 3
  }
];

let data = {};
let metaData = {};

data.organization = [
  {
    name: 'Renascent Inc'
  },
  {
    name: 'Caterpillar'
  },
  {
    name: 'DeWalt'
  }
];

data.configurable_item = [ ];

for (var i = 0; i < data.organization.length; i++) {
  for (let configurable_item_type in configurable_items) {
    let configurable_item_type_names = configurable_items[configurable_item_type];
    for (let configurable_item_type_name of configurable_item_type_names) {
      data.configurable_item.push({
        type: configurable_item_type,
        name: configurable_item_type_name,
        sanctioned: dataUtil.getRandBool(),
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
    name: null
  },
  {
    city: 'Nashville',
    state: 'TN',
    zip:  '29298',
    organization_id: 3,
    address_line_one: '9183 Working Way',
    address_line_two: 'Greenfield Tower Room 3456',
    name: null
  }
];

data.user = []
for (let single_user_info of user_info) {
  data.user.push({
    first_name: single_user_info.first_name,
    last_name: single_user_info.last_name,
    email: `${single_user_info.first_name.toLowerCase()}.${single_user_info.last_name.toLowerCase()}@renascentinc.com`,
    phone_number: dataUtil.getRandPhoneNumber(),
    password: 'Test1234!',
    role: dataUtil.getRandFromArray(roles),
    status: dataUtil.getRandFromArray(user_statuses),
    organization_id: single_user_info.organization_id
  });
}

metaData.tool_owner = [
  ...(data.location.map(location => ({...location, type: 'LOCATION'}))),
  ...(data.user.map(location => ({...location, type: 'USER'})))
];

data.tool = []
let numTools = 50;

for (var i = 0; i < numTools; i++) {
  let randOrgId = dataUtil.getRandIdFromArray(data.organization);
  let assignedToLocation = dataUtil.getRandBool();
  let { objects, originalIndecies } = dataUtil.getFromObjectArrayWhere(data.configurable_item, 'organization_id', randOrgId);
  data.tool.push({
    type_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(objects, 'type', 'TYPE') - 1] + 1,
    brand_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(objects, 'type', 'BRAND') - 1] + 1,
    purchased_from_id: originalIndecies[dataUtil.getRandIdFromObjectArrayWhere(objects, 'type', 'PURCHASED_FROM') - 1] + 1,
    date_purchased: dataUtil.createRandomDate(),
    model_number: dataUtil.createRandomId(),
    status: dataUtil.getRandFromArray(tool_statuses),
    serial_number: dataUtil.createRandomId(),
    organization_id: randOrgId,
    owner_id: dataUtil.getRandIdFromObjectArrayWhere(metaData.tool_owner, 'organization_id', randOrgId),
    price: null,
    photo: null,
    year: null,
  })
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

module.exports = { data, metaData };
