require('./ascii-art').printBoot();

const logger = require('./logger');
const Application = require('./application');

async function main(args) {

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
