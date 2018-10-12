// const Enum = require('es6-enum');
'use strict';

const Enum = require('enums');

let x = {r: 4}
let y = {r: 4}

Object.defineProperty(x, 'eql', {
  configurable: true,
  enumerable: false,
  value: function(that) {
    console.log(that)
    return true
  }
})

Object.defineProperty(y, 'eql', {
  configurable: true,
  enumerable: false,
  value: function(that) {
    console.log(that)
    return true
  }
})

console.log(x == y);

let blahType =  new Enum({
    name: 'CLOSED',
    code: '1',
    message: 'Shop close'
  },
  {
    name: 'OPENED',
    code: '2',
    message: 'Shop open'
  });

  let blahType2 =  new Enum({
      name: 'CLOSED',
      code: '1',
      message: 'Shop close'
    },
    {
      name: 'OPENED',
      code: '2',
      message: 'Shop open'
    });

console.log(blahType.getBy('name', 'CLOSED') == blahType2.CLOSED)
