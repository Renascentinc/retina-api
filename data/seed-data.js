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
  'MAINTENENCE',
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
    first_name: 'Bob',
    last_name: 'Thompson',
    organization_id: 1
  },
  {
    first_name: 'Bill',
    last_name: 'Hathaway',
    organization_id: 1
  },
  {
    first_name: 'Fred',
    last_name: 'Richardson',
    organization_id: 2
  },
  {
    first_name: 'Sam',
    last_name: 'Smith',
    organization_id: 2
  },
  {
    first_name: 'Rick',
    last_name: 'Dickson',
    organization_id: 3
  }
];

let data = {};

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
    email: `${single_user_info.first_name.toLowerCase()}.${single_user_info.last_name.toLowerCase()}@somecompany.com`,
    phone_number: dataUtil.getRandPhoneNumber(),
    password: 'Test1234!',
    role: dataUtil.getRandFromArray(roles),
    status: dataUtil.getRandFromArray(user_statuses),
    organization_id: single_user_info.organization_id
  });
}

data.tool = []
let numTools = 40;

for (var i = 0; i < numTools; i++) {
  let randOrgId = dataUtil.getRandIdFromArray(data.organization);
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
    location_id: dataUtil.getRandIdFromObjectArrayWhere(data.location, 'organization_id', randOrgId),
    price: null,
    photo: null,
    year: null,
    user_id: dataUtil.getRandIdFromObjectArrayWhere(data.user, 'organization_id', randOrgId)
  })
}

if (appConfig['environment'] == 'test') {
  data.session = [];

  for (let i = 0; i < data.user.length; i++) {
    data.session.push({
      user_id: i + 1,
      organization_id: data.user[i].organization_id
    });
  }
}

module.exports = { data };
