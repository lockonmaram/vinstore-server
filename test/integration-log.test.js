/* global describe it */
const integrationLogAction = require('../app/action/integration-log.action');

module.exports = (server, assert, dataTest) => {
  describe('Integration-Log | Action', () => {
    it('Insert Integration Log, Should Return 200', async () => {
      try {
        const integrationLog = await integrationLogAction.create(dataTest.integrationLog);
        assert.isNotNull(integrationLog);
      } catch (error) {
        assert.ifError(error);
      }
    });
  });

  describe('Integration-Log | End-Point', () => {
    it('Insert Integration Log Through Endpoint, Should Return 200', async () => {
      try {
        const result = await server
          .post('/v1/log/integration')
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
