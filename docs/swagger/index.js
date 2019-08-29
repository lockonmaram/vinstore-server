const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuthModule = require('basic-auth');
const config = require('../../config');

function basicAuth() {
  return (req, res, next) => {
    const user = basicAuthModule(req);
    if (!user || user.name !== config.get('basic-auth-credential').name || user.pass !== config.get('basic-auth-credential').pass) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.sendStatus(401);
    } else {
      next();
    }
  };
}

module.exports = (router) => {
  const docTitle = config.get('swagger').title;
  const docVersion = config.get('swagger').version;

  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: docTitle,
        version: docVersion,
      },
    },
    apis: ['./router/*.js'],
  });

  const showExplorer = false;
  const options = {};
  const customCss = '';
  const customFavicon = '';
  const swaggerUrl = '';

  router.use(
    '/',
    basicAuth(),
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerSpec,
      showExplorer,
      options,
      customCss,
      customFavicon,
      swaggerUrl,
      docTitle,
      (req, res, next) => {
        next();
      },
    ),
  );
};
