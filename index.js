"use strict"

//Importamos la libreria
var mongoose = require('mongoose');

//Crea la conexion con mongoDB y la bbdd
mongoose.connect('mongodb://localhost:27017/gitBand', (err, res) => {
	if(err) {
		throw err;
	} else {
		console.log("Database its running corretly");
	}
});