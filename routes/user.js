"use strict"

var express = require('express');
//Cargamos el controlador del usuario
var UserController = require('../controllers/user.js');
//Cargamos un middleware
var md_auth = require('../middlewares/authenticated.js');

//Cargamos el api de Router para poder crear rutas
var api = express.Router();

//RUTAS
//Indicamos el metodo del controlador que queremos que ejecute
api.get('/probando', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;