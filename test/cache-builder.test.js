/* eslint-disable no-param-reassign */
/* global describe it */

const _ = require('lodash');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);
const cacheBuilderAction = require('../app/action/cache-builder.action');
const { GET_ITEM, GET_ITEM_BY_NAME } = require('../app/db/models/Redis/item');

module.exports = (server, assert) => {
  describe('Cache-Builder | Action', () => {
    const scenario = {
      test1: {
        Keys: GET_ITEM,
        keysParams: {
          condition: {},
          fields: [],
          include: [],
        },
        result: 'item:{}::::[]',
        data: {
          count: 2,
          rows: [
            {
              itemId: 1,
              itemName: 'Unit Test1',
            },
            {
              itemId: 2,
              itemName: 'Unit Test2',
            },
          ],
        },
      },
      test2: {
        Keys: GET_ITEM,
        keysParams: {
          condition: {
            kategoriId: 186,
          },
          fields: [],
          include: [
            {
              model: {
                name: 'kategori',
              },
              where: {
                kategoriId: 186,
              },
            },
          ],
        },
        result: 'item:{"kategoriId"=186}::::[{"model"="kategori","where"={"kategoriId"=186}}]',
      },
      test3: {
        Keys: GET_ITEM,
        keysParams: {
          condition: {
            kategoriId: 186,
            itemId: 20,
          },
          fields: ['itemId', 'itemName', 'date'],
          include: [
            {
              model: {
                name: 'kategori',
              },
              where: {
                kategoriId: 186,
              },
            },
            {
              model: {
                name: 'price',
              },
            },
          ],
          page: 2,
          limit: 10,
        },
        result: 'item:{"kategoriId"=186,"itemId"=20}:2:10:itemId,itemName,date:[{"model"="kategori","where"={"kategoriId"=186}},{"model"="price"}]',
      },
      test4: {
        Keys: GET_ITEM_BY_NAME,
        keysParams: 'test-cache-string',
        result: 'item:by-name:test-cache-string',
      },
    };

    it('Generate Keys Test 1, Should Be True', async () => {
      try {
        const { key } = await cacheBuilderAction.getCacheRedis(
          scenario.test1.Keys,
          scenario.test1.keysParams,
        );

        assert.equal(key, scenario.test1.result);
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Generate Keys Test 2, Should Be True', async () => {
      try {
        const { key } = await cacheBuilderAction.getCacheRedis(
          scenario.test2.Keys,
          scenario.test2.keysParams,
        );

        assert.equal(key, scenario.test2.result);
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Generate Keys Test 3, Should Be True', async () => {
      try {
        const { key } = await cacheBuilderAction.getCacheRedis(
          scenario.test3.Keys,
          scenario.test3.keysParams,
        );

        assert.equal(key, scenario.test3.result);
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Generate Keys Test 4, Should Be True', async () => {
      try {
        const { key } = await cacheBuilderAction.getCacheRedis(
          scenario.test4.Keys,
          scenario.test4.keysParams,
        );

        assert.equal(key, scenario.test4.result);
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Set cache test 1, Should Be True', async () => {
      try {
        const set = cacheBuilderAction.setCacheRedis(
          scenario.test1.result,
          scenario.test1.data,
          105,
        );

        await setTimeoutPromise(100);
        assert.equal(set, 'cache has been set');
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Get cache test 1, Should Be True', async () => {
      try {
        const { cache } = await cacheBuilderAction.getCacheRedis(
          scenario.test1.Keys,
          scenario.test1.keysParams,
        );

        assert.isNotNull(cache, 'Should be not null');
        assert.equal(cache.count, scenario.test1.data.count);
      } catch (error) {
        assert.ifError(error);
      }
    });

    it('Del cache test 1, Should Be True', async () => {
      try {
        const delWild = cacheBuilderAction.delWildCacheRedis(scenario.test1.Keys);

        assert.isDefined(delWild, 'Should be defined');
        assert.equal(_.isString(delWild), true);

        await setTimeoutPromise(100);
        const { cache } = await cacheBuilderAction.getCacheRedis(
          scenario.test1.Keys,
          scenario.test1.keysParams,
        );

        assert.isNull(cache, 'Should be null');
      } catch (error) {
        assert.ifError(error);
      }
    });
  });
};
