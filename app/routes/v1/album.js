/* global Helpers */
const { albumAction } = require('../../action');

const getAlbums = async (req, res) => {
  try {
    const result = await albumAction.get();
    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

const getAlbumByArtist = async (req, res) => {
  try {
    req.checkBody({
      artist: { notEmpty: true, errorMessage: 'artist is Required' },
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const result = await albumAction.get(req.body);
    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

const addAlbum = async (req, res) => {
  try {
    req.checkBody({
      title: { notEmpty: true, errorMessage: 'title is Required' },
      cover: { notEmpty: true, errorMessage: 'cover is Required' },
      price: { notEmpty: true, errorMessage: 'price is Required' },
      artist: { notEmpty: true, errorMessage: 'artist is Required' }
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const result = await albumAction.create(req.body);
    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

const deleteAlbum = async (req, res) => {
  try {
    req.checkBody({
      albumId: { notEmpty: true, errorMessage: 'albumId is Required' }
    });
    const errors = req.validationErrors();
    if (errors) {
      return Helpers.error(res, errors);
    }

    const result = await albumAction.del(req.body);
    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

module.exports = (router) => {
  router.get('/', getAlbums);
  router.post('/', getAlbumByArtist);
  router.post('/add', addAlbum);
  router.delete('/delete', deleteAlbum);
};
