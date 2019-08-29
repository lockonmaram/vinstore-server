const fastStringify = require('fast-safe-stringify');
const JSONparse = require('fast-json-parse');
const redisPoolCon = require('redis-pool-connection');
const config = require('../../../config');

const redisClient = redisPoolCon(config.get('REDIS'));

const redisCache = {
  set: (key, data) => {
    redisClient.set(key, fastStringify(data));
  },
  setex: (key, ttl, data) => {
    const expiredTime = ttl || 60;
    redisClient.setex(key, expiredTime, fastStringify(data));
  },
  del: (key) => {
    redisClient.del(key, (err, res) => {
      if (err) return (err);
      return res;
    });
  },
  delwild: (key) => {
    redisClient.delwild(key, (err, res) => {
      if (err) return err;
      return res;
    });
  },
  get: key => new Promise((resolve, reject) => {
    redisClient.get(key, (err, response) => {
      if (!err && response) {
        const data = JSONparse(response);
        resolve(data.value);
      } else if (err) reject(err);
      else resolve(null);
    });
  }),
  expire: (key, ttl) => {
    redisClient.expire(key, ttl);
  },
  ttl: {
    FIVE_MINUTE: 300,
    TEN_MINUTE: 600,
    HALF_HOUR: 1800,
    ONE_HOUR: 3600,
    TWO_HOUR: 7200,
    SIX_HOUR: 21600,
  },
};

redisClient.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Redis Connected');
});

redisClient.on('error', (err) => {
  throw err;
});

module.exports = redisCache;
