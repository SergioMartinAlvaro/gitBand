/*Aqui vamos a realizar la logica de express y bodyparser,
configuraremos rutas, cabeceras ... */

"use strict"

//Traemos las librerias
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//RUTAS, cargamos los ficheros de rutas
var user_routes = require('./routes/user.js');
var artist_routes = require('./routes/artist.js');
var album_routes = require('./routes/albums.js');

//CONFIG BODYPARSER

app.use(bodyParser.urlencoded({extended:false}));
//Transforma a JSON las peticiones que nos lleguen por HTTP
app.use(bodyParser.json());

//CONFIG HEADERS

//RUTAS BASE

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);

//Exportamos el modulo a otros ficheros que usen app
module.exports = app;
