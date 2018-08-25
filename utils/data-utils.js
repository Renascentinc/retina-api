const uuid = require('uuid');
var randomDate = require('random-datetime');

class Util {
  getRandIdFromTable(type) {
    if (data[type] == undefined) {
      throw new Error(`Passed in type ${type} isn't a valid type`);
    }

    if (data[type].length < 1) {
      throw new Error(`There are no entries for type ${type}`);
    }

    return Math.floor(Math.random() * data[type].length) + 1;
  }

  getRandIndexFromArray(array) {
    return Math.floor(Math.random() * array.length) + 1;
  }

  getRandBool() {
    return Math.random() > 0.5 ? true : false;
  }

  getRandFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandFromObjectArrayWhere(array, key, value) {
    let ids = []
    array.forEach((object, i) => {
     if (object[key] == value) {
       ids.push(i+1);
     }
    });

    return this.getRandFromArray(ids);
  }

  getFromObjectArrayWhere(array, key, value) {
    let objects = []
    array.forEach((object, i) => {
     if (object[key] == value) {
       objects.push(object);
     }
    });

    return objects;
  }

  getRandNameAndValFromArrayObject(object) {
    let keys = Object.keys(object);
    let arrayName = this.getRandFromArray(keys);
    let vals = object[arrayName];
    let value = this.getRandFromArray(vals);
    return { arrayName, value }
  }

 createRandomId() {
   return uuid().replace(/-/g,'').substr(0,15);
 }

 createRandomDate() {
   return randomDate();
 }
}

module.exports = new Util();
