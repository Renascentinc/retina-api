
const logger = require('./logger');
const Application = require('./application');
const appConfig = require('./app-config');
const { createDb } = require('./create-db');

async function main(args) {
  if (appConfig['db.create']) {
    try {
      await createDb();
    } catch (e) {
      logger.warn(`Unable to create database \n${e}"`);
      process.exit(1);
    }
  }

  let app = new Application();

  try {
    await app.start();
  } catch (e) {
    logger.error(`Unable to start application \n${e}"`);
    process.exit(1);
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

main();
