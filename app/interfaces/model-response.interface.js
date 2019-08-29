const implementjs = require('implement-js');

const { Interface, type } = implementjs;

const ModelReponse = Interface('ModelReponse')({
  count: type('number'),
  rows: type('array', [type('object')]),
},
{
  error: true,
  strict: true,
});

module.exports = ModelReponse;
