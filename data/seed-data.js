
let dataUtil = require('../utils/data-utils');

let configurable_items = {
  brand: [
    'Bosch',
    'DeWalt',
    'Milwaukee',
    'Makita',
    'Hilti'
  ],
  purchased_from: [
    'Lowes',
    'Menards',
    'Home Depot'
  ],
  type: [
    '12v Drill',
    'Sledgehammer',
    'Chainsaw',
    'Sawzall',
    'Hammer',
    'Fuel Pump'
  ]
}

let statuses = [
  'Available',
  'In Use',
  'Maintenance',
  'Out of Service'
]

let roles = [
  'user',
  'administrator'
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
    organization_id: dataUtil.getRandIndexFromArray(data.organization)
  })
}

data.tool = []
let numTools = 20;

for (var i = 0; i < numTools; i++) {
  data.tool.push(  {
    type_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'type'),
    brand_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'brand'),
    date_purchased: dataUtil.createRandomDate(),
    purchased_from_id: dataUtil.getRandFromObjectArrayWhere(data.configurable_item, 'type', 'purchased_from'),
    model_number: dataUtil.createRandomId(),
    status: dataUtil.getRandFromArray(statuses),
    serial_number: dataUtil.createRandomId(),
    organization_id: dataUtil.getRandIndexFromArray(data.organization)
  })
}

module.exports = { data };
