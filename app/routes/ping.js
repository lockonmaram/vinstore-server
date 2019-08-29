/* global Helpers */
module.exports = (router) => {
  router.get('/', (req, res) => Helpers.response(res, 'Pong!'));
};
