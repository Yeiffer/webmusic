'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); //crear ruta para nuestra apis
var md_auth = require('../middleware/authenticated');

var multipart = require('connect-multiparty'); //subir ficheros
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); //opciona id?
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
module.exports = api;