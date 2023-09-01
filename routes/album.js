'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router(); //hacer llamados get,post,put
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty'); //subir ficheros
var md_upload = multipart({ uploadDir: './uploads/album' });

api.get('/album', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);

module.exports = api;