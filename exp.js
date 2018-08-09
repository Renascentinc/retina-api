
const {getDbClientInstance} = require('./retina-db-client')

const {callIt} = require('./exp2')

let boogie;

boogie = getDbClientInstance();
boogie = getDbClientInstance();

callIt();
