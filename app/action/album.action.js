const { mongodb } = require('../server');

const Album = mongodb.model('Album');

const create = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const createAlbum = await Album.create(data);
    return resolve(createAlbum);
  } catch (error) {
    return reject(error);
  }
});

const get = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const getAlbum = await Album.find(data);
    return resolve(getAlbum);
  } catch (error) {
    return reject(error);
  }
});

const update = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const updateAlbum = await Album.update(data);
    return resolve(updateAlbum);
  } catch (error) {
    return reject(error);
  }
});

const del = (
  data = {},
) => new Promise(async (resolve, reject) => {
  try {
    const deleteAlbum = await Album.deleteOne(data);
    return resolve(deleteAlbum);
  } catch (error) {
    return reject(error);
  }
});

module.exports = {
  create,
  get,
  update,
  del
};
