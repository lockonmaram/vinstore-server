const _ = require('lodash');
const { format } = require('util');
const redisClients = require('../db/datasource/Redis');

const getCacheRedis = async (
  key,
  keysParams,
) => {
  try {
    let generatedKey = '';
    if (_.isString(keysParams)) {
      // Only Support 1 %s Token string to insert;
      generatedKey = format(key, keysParams);
    } else {
      const build = [];
      let condition = JSON.stringify(_.result(keysParams, 'condition', {}));
      condition = _.replace(condition, /:/g, '='); // Replace ":" to prevent delimeter, by default Redis make Tree Separate keys by ":"
      const page = _.result(keysParams, 'page', '');
      const limit = _.result(keysParams, 'limit', '');
      const fields = _.chain(keysParams).result('fields', '').join(',').value();
      const include = _.chain(keysParams)
        .result('include', [])
        .map(val => ({
          model: val.model.name,
          where: val.where,
        }))
        .value();
      let includeToString = JSON.stringify(include);
      includeToString = _.replace(includeToString, /:/g, '='); // Replace ":" to prevent delimeter, by default Redis make Tree Separate keys by ":"

      build.push(condition, page, limit, fields, includeToString);
      generatedKey = format(key, _.join(build, ':'));
    }

    const cache = await redisClients.get(generatedKey);
    const result = {
      key: null,
      cache: null,
    };
    if (cache) {
      result.cache = cache;
    }
    result.key = generatedKey;
    return result;
  } catch (err) {
    throw err;
  }
};

const setCacheRedis = (key, data, ttl) => {
  let message = 'cache has been set';
  if (data) {
    redisClients.setex(key, ttl, data);
    return message;
  }
  message = 'data unavaliable to cache';
  return message;
};

const delWildCacheRedis = (key) => {
  const message = 'cache has been delete';
  const keyFormat = format(key, '*');
  redisClients.delwild(keyFormat);
  return message;
};

module.exports = {
  getCacheRedis,
  setCacheRedis,
  delWildCacheRedis,
};
