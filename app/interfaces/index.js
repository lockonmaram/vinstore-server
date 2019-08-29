/* global Helpers */
const path = require('path');

const basename = path.basename(__filename);

module.exports = Helpers.loadFile(__dirname, basename);
