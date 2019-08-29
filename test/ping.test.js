/* global describe it */

module.exports = (server, assert, dataTest, mongo) => {
  describe('Ping', () => {
    it('Should Return 200', (done) => {
      server
        .get('/ping')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, resp) => {
          if (err) {
            return done(err);
          }
          assert.equal(resp.body.status, 200);
          return done();
        });
    });
  });
};
