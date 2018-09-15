const uuid = require('uuid');
const faker = require('faker');


class Util {
  getRandIndexFromArray(array) {
    return Math.floor(Math.random() * array.length);
  }

  getRandIdFromArray(array) {
    return this.getRandIndexFromArray(array) + 1;
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
   return faker.date.recent();
 }

 getRandPhoneNumber() {
   return faker.phone.phoneNumber('(###) ###-####');
 }

 getRandPassword() {
   return faker.internet.password();
 }
}

module.exports = new Util();
