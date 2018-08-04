const logger = require('./logger');

class Db {
  
  constructor() {
    logger.info('constructing db');
  }

  cutConnection() {
    logger.info('cutting connection');
  }

}

module.exports = Db;
