const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const config = require('../../config');

const logDir = `${config.get('LOG_DIR')}/`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: '%DATE%.log',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
});

const winstonLogger = new winston.Logger({
  transports: [transport],
});

const logger = {
  info: (params) => {
    winstonLogger.info(JSON.stringify(params));
  },
  error: (params) => {
    winstonLogger.info(JSON.stringify(params));
  },
};

module.exports = logger;
