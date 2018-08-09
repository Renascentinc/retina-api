const winston = require('winston');

//TODO Improve logging: https://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js
const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()),
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'silly'
  }));
}

module.exports = logger;
