
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

let user_names = [
  {
    first_name: 'Bob',
    last_name: 'Thompson'
  },
  {
    first_name: 'Bill',
    last_name: 'Hathaway'
  },
  {
    first_name: 'Fred',
    last_name: 'Richardson'
  },
  {
    first_name: 'Sam',
    last_name: 'Smith'
  },
  {
    first_name: 'Rick',
    last_name: 'Dickson'
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
let numConfItems = 20;

for (var i = 0; i < numConfItems; i++) {
  let { arrayName, value } = dataUtil.getRandNameAndValFromArrayObject(configurable_items);
  data.configurable_item.push({
    type: arrayName,
    name: value,
    sanctioned: dataUtil.getRandBool(),
    organization_id: dataUtil.getRandIdFromArray(data.organization)
  })
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

data.tool = []
let numTools = 20;

for (var i = 0; i < numTools; i++) {
  data.tool.push(  {
    type_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'TYPE'),
    brand_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'BRAND'),
    date_purchased: dataUtil.createRandomDate(),
    purchased_from_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'PURCHASED_FROM'),
    model_number: dataUtil.createRandomId(),
    status: dataUtil.getRandFromArray(tool_statuses),
    serial_number: dataUtil.createRandomId(),
    organization_id: dataUtil.getRandIdFromArray(data.organization),
    location_id: dataUtil.getRandIdFromArray(data.location),
    price: null,
    photo: null,
    year: null,
    user_id: null
  })
}

data.user = []
for (let user_name of user_names) {
  data.user.push({
    first_name: user_name.first_name,
    last_name: user_name.last_name,
    email: `${user_name.first_name.toLowerCase()}.${user_name.last_name.toLowerCase()}@somecompany.com`,
    phone_number: dataUtil.getRandPhoneNumber(),
    password: dataUtil.getRandPassword(),
    role: dataUtil.getRandFromArray(roles),
    status: dataUtil.getRandFromArray(user_statuses),
    organization_id: dataUtil.getRandIdFromArray(data.organization)
  });
}

data.session = [];
let numSessions = 5;

for (var i = 0; i < numSessions; i++) {
  data.session.push({
    token: dataUtil.createRandomId(),
    user_id: dataUtil.getRandIdFromArray(data.user),
    organization_id: dataUtil.getRandIdFromArray(data.organization)
  });
}


module.exports = { data };
