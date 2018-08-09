const {getDbClientInstance} = require('./retina-db-client')



function callIt() {
  let boogie;

  boogie = getDbClientInstance();
  boogie = getDbClientInstance();
}

module.exports = {callIt}
