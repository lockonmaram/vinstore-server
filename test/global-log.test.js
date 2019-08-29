/* global describe it */
const globalLogAction = require('../app/action/global-log.action');

module.exports = (server, assert, dataTest) => {
  describe('Global-Log | Action', () => {
    it('Insert Global Log, Should Return 200', async () => {
      try {
        const globalLog = await globalLogAction.create(dataTest.globalLog);
        assert.isNotNull(globalLog);
      } catch (error) {
        assert.ifError(error);
      }
    });
  });

  describe('Global-Log | End-Point', () => {
    it('Insert Global Log Through Endpoint, Should Return 200', async () => {
      try {
        const result = await server
          .post('/v1/log')
          .send(dataTest.globalLog)
          .expect('Content-type', /json/)
          .expect(200);

        assert.isNotNull(result.body.data);
      } catch (error) {
        assert.ifError(error);
      }
    });
  });
};
