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
};

// require('./ping.test')(server, assert, dataTest, mongodb);

after((done) => {
  // TODO: Delete Seed Data
  done();
});
