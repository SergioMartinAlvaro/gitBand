/*Aqui vamos a realizar la logica de express y bodyparser,
configuraremos rutas, cabeceras ... */

"use strict"

//Traemos las librerias
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

//RUTAS

//CONFIG BODYPARSER

app.use(bodyParser.urlencoded({extended:false}));
//Transforma a JSON las peticiones que nos lleguen por HTTP
app.use(bodyParser.json());

//CONFIG HEADERS

//RUTAS BASE

app.get('/pruebas', function(req, res) {
	res.status(200).send({message: "Bienvenido a mi web"});
});

//Exportamos el modulo a otros ficheros que usen app
module.exports = app;
