const Album = require('../models/album')

class AlbumController {
  static getAlbums(req, res){
    Album.find()
    .then(albums=>{
      // console.log('asdasdfawefef',albums);
      res.status(200).json(albums)
    })
    .catch(err=>{
      res.status(400),json(err)
    })
  }
  static getAlbum(req, res){
    Album.find({ artist: req.body.artist })
    .then(albums=>{
      // console.log('asdasdfawefef',albums);
      res.status(200).json(albums)
    })
    .catch(err=>{
      res.status(400),json(err)
    })
  }
  static addAlbum(req, res){
    Album.create({
      title: req.body.title,
      cover: req.body.cover,
      price: req.body.price,
      artist: req.body.artist
    })
    .then(album=>{
      res.status(200).json(album)
    })
    .catch(err=>{
      res.status(400),json(err)
    })
  }
  static deleteAlbum(req, res){
    // console.log(req.body.albumId);
    Album.deleteOne({ _id: req.body.albumId })
    .then(result=>{
      res.status(200).json('album successfully deleted')
    })
    .catch(err=>{
      res.status(400).json(err)
    })
  }
}

module.exports = AlbumController
