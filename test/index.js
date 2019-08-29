/* global before after */
const supertest = require('supertest');
const { assert } = require('chai');
const cuid = require('cuid');
const App = require('../app/server');

const server = supertest(App.app);
const { mongodb } = App;

// const USER_UNIT_TEST = 'UnitTesting1';
const requestId = cuid();
const dataTest = {
  globalLog: {
    requestId,
    description: 'Test Description 1',
    phoneNumber: '087744059690',
    serviceName: 'Test Service Name 1',
    type: 'info',
    data: {
      name: 'Test',
    },
  },
  integrationLog: {
    requestId,
    description: 'Test Description 2',
    phoneNumber: '087708062690',
    serviceName: 'Test Service Name 2',
    type: 'info',
    data: {
      fields: ['itemName', 'itemCode'],
      tableName: 'item',
    },
    createdBy: 'jumin test1',
  },
};

before((done) => {
  // TODO: Seed Data
  setTimeout(done, 2000);
});

require('./ping.test')(server, assert, dataTest, mongodb);
require('./cache-builder.test')(server, assert);
require('./formating.test')(server, assert);
require('./global-log.test')(server, assert, dataTest, mongodb);
require('./integration-log.test')(server, assert, dataTest, mongodb);

after((done) => {
  // TODO: Delete Seed Data
  done();
});
