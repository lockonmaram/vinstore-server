/* eslint-disable no-new */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const albumSchema = new Schema({
  title: {
    type: String
  },
  cover: {
    type: String
  },
  price: {
    type: Number
  },
  artist: {
    type: String
  },
});

module.exports = mongoose.model('Album', albumSchema);