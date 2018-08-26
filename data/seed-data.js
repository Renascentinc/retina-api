
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

let statuses = [
  'AVAILABLE',
  'IN_USE',
  'MAINTENENCE',
  'OUT_OF_SERVICE'
]

let roles = [
  'USER',
  'ADMINISTRATOR'
]

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
    organization_id: dataUtil.getRandIndexFromArray(data.organization) + 1
  })
}

data.location = [
  {
    city: 'Indianapolis',
    state: 'IN',
    zip:  '46225',
    organization_id: 1,
    address_line_one: '935 W. Troy Ave.',
    name: "The Shop"
  },
  {
    city: 'Bloomington',
    state: 'IN',
    zip:  '28271',
    organization_id: 2,
    address_line_one: '7638 Construction Ln.'
  },
  {
    city: 'Nashville',
    state: 'TN',
    zip:  '29298',
    organization_id: 3,
    address_line_one: '9183 Working Way',
    address_line_two: 'Greenfield Tower Room 3456'
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
    status: dataUtil.getRandFromArray(statuses),
    serial_number: dataUtil.createRandomId(),
    organization_id: dataUtil.getRandIndexFromArray(data.organization) + 1,
    location_id: dataUtil.getRandIdFromArray(data.location)
  })
}

module.exports = { data };
