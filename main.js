
const logger = require('./logger');
const Server = require('./server');

async function main() {
  let server = new Server();
  await server.start();

  process.on('SIGTERM', async () => {
    logger.silly(`Shutting down app on signal 'SIGTERM'`);
    await server.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.silly(`Shutting down app on signal 'SIGINT'`);
    await server.shutdown();
    process.exit(0);
  });
}

main();
