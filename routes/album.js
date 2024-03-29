'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router(); //hacer llamados get,post,put
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty'); //subir ficheros
var md_upload = multipart({ uploadDir: './uploads/album' });

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artista', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;