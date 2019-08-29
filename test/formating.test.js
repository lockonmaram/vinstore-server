/* global describe it */
const formatingAction = require('../app/action/formating.action');

module.exports = (server, assert) => {
  describe('Formating | Action', () => {
    it('Formating Phone Number Phone, Should Return 200', async () => {
      try {
        const noHp = '087708059690';
        const phoneNumber = formatingAction.formatPhoneNumber(noHp);
        assert.equal(phoneNumber, '6287708059690');
      } catch (error) {
        assert.ifNull(error);
      }
    });
  });
};
