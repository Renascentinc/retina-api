
const logger = require('./logger');
const Application = require('./application');
const appConfig = require('./app-config');

async function main(args) {
  if (appConfig['db.refresh']) {
    await refreshDb();
  }

  // let app = new Application();

  try {
    // await app.start();
  } catch (e) {
    logger.error(`Unable to start application because of error "${e}"`);
  }

  process.on('SIGTERM', async () => {
    logger.silly(`Shutting down app on signal 'SIGTERM'`);
    await app.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.silly(`Shutting down app on signal 'SIGINT'`);
    await app.shutdown();
    process.exit(0);
  });
}

main(require('minimist')(process.argv.slice(2)));
