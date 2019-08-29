/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */

const path = require('path');
const extend = require('extend');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');

const rootPath = path.join(__dirname, '/../models/Mongodb');


module.exports = (config, selectedModel) => {
  function getFileName(loc) {
    const p = loc;
    return loc.basename(p, loc.extname(p));
  }

  mongoose.Promise = global.Promise;

  async function run() {
    const opt = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      w: 'majority',
      wtimeout: 10000,
      j: true,
      autoIndex: false,
      useNewUrlParser: true,
    };

    const options = extend({}, opt, config);

    delete options.url;

    await mongoose.connect(config.url, options);

    mongoose.connection.on('error', (err) => {
      console.error(`✗ MongoDB Connection is Error. Please make sure MongoDB is running. -> ${err}`);
      throw err;
    });

    mongoose.connection.on('reconnect', (err) => {
      console.error(`✗ Try to reconnect to MongoDB. ${err}`);
    });

    mongoose.connection.on('reconnectFailed', (err) => {
      console.error(`✗ Try to reconnect to MongoDB. ${err}`);
      throw err;
    });

    // mongoose.set('debug', true)
  }

  run().catch((error) => {
    if (error) {
      console.error(error);
    }
  });

  const gracefulExit = () => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  };

  process.on('SInGINT', gracefulExit).on('SIGTERM', gracefulExit);

  if (selectedModel && selectedModel.length > 0) {
    readdirSync(`${rootPath}`)
      .filter(file => file.indexOf('.js'))
      .filter(file => selectedModel.includes(getFileName(file)))
      .forEach((file) => {
        // eslint-disable-next-line global-require
        require(path.join(`${rootPath}`, file));
      });
  } else {
    readdirSync(`${rootPath}`)
      .filter(file => file.indexOf('.js'))
      .forEach((file) => {
        // eslint-disable-next-line global-require
        require(path.join(`${rootPath}`, file));
      });
  }

  // mongoose.set('debug', true)

  return mongoose;
};
