const winston = require('winston');
const appConfig = require('./app-config');

//TODO Improve logging: https://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js

let consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
  level: 'silly'
});

const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
    consoleTransport
  ]
});

if (appConfig['environment'] == 'local' || appConfig['environment'] == 'test') {
  consoleTransport.format = winston.format.combine(
    winston.format.colorize(),
    consoleTransport.format
  );
}

module.exports = logger;
