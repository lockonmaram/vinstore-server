var express = require('express');
var router = express.Router();
var albumController = require('../controllers/albumsController')

/* GET albums listing. */
router.get('/', albumController.getAlbums);
router.post('/', albumController.getAlbum);
router.post('/add', albumController.addAlbum);
router.delete('/delete', albumController.deleteAlbum);

module.exports = router;
