/* eslint-disable no-new */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    require: true
  },
  last_name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  isAdmin: {
    type: String,
    default: 'false'
  },
  password: String,
  salt: String,
  transaction: {
    type: Array,
    default: []
  }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

module.exports = mongoose.model('User', userSchema);
