var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
  title: String,
  cover: String,
  price: Number,
  artist: String
});

var Album = mongoose.model('Album', albumSchema);

module.exports = Album
