"use strict"

var express = require('express');
//Cargamos el controlador del usuario
var UserController = require('../controllers/user.js');
//Cargamos un middleware
var md_auth = require('../middlewares/authenticated.js');
//Cargamos multipart, para subir ficheros
var multipart = require('connect-multiparty');
//Middleware con ruta hacia donde se subiran las imagenes
var mp_upload = multipart({ uploadDir : './uploads/users' });

//Cargamos el api de Router para poder crear rutas
var api = express.Router();

//RUTAS
//Indicamos el metodo del controlador que queremos que ejecute
api.get('/probando', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, mp_upload], UserController.uploadImage);

module.exports = api;