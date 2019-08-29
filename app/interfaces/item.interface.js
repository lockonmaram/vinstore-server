const implementjs = require('implement-js');

const { Interface, type } = implementjs;
const ModelReponse = require('./model-response.interface');

const Items = Interface('Items')({
  items: type('object', ModelReponse),
  isCache: type('boolean'),
},
{
  error: true,
  strict: true,
});

module.exports = Items;
