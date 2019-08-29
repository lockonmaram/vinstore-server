const { mongodb } = require('../server');
const User = mongodb.model('User');
const jwt = require('jsonwebtoken')
const config = require('../../config');

const create = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const { salt, hash } = await Helpers.hashString(data.password);
    const userData = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: hash,
      salt: salt
    };
  
    const result = await User.create(userData);

    return resolve(result);
  } catch (error) {
    return reject(error);
  }
});

const generateWebToken = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const tokenUser = await jwt.sign({
      id: data._id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      isAdmin: data.isAdmin
    }, config.get('JWT_SECRET_KEY'));

    const result = {
      token: tokenUser, 
      userId: data._id, 
      first_name: data.first_name, 
      last_name: data.last_name, 
      isAdmin: data.isAdmin 
    };

    return resolve(result);
  } catch (error) {
    return reject(error);
  }
});

const verifyPassword = (
  data = {},
  userData = {}
) => new Promise(async (resolve, reject) => {
  try {
    const result = await Helpers.verifyString(data.password, userData.salt, userData.password);
    return resolve(result);
  } catch (error) {
    return reject(error);
  }
});

const get = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const getUser = await User.find(data);
    return resolve(getUser);
  } catch (error) {
    return reject(error);
  }
});

const getOne = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const getUser = await User.findOne(data);
    return resolve(getUser);
  } catch (error) {
    return reject(error);
  }
});

const updateOne = (
  where,
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const updateUser = await User.updateOne(where, data);
    return resolve(updateUser);
  } catch (error) {
    return reject(error);
  }
});

const del = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const deleteUser = await User.deleteOne(data);
    return resolve(deleteUser);
  } catch (error) {
    return reject(error);
  }
});

module.exports = {
  create,
  generateWebToken,
  verifyPassword,
  get,
  getOne,
  updateOne,
  del
};
