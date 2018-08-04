
const logger = require('./logger');
const Application = require('./application');

async main() {
  let app = new Application();
  async app.start();

  process.on('SIGTERM', () => {
    logger.silly(`Shutting down app on signal 'SIGTERM'`);
    async app.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.silly(`Shutting down app on signal 'SIGINT'`);
    async app.shutdown();
    process.exit(0);
  });
}

main();
