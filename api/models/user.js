"use strict"

var mongoose = require("mongoose");
//creamos Schema para permitirnos guardar datos en la BBDD
var Schema = mongoose.Schema;

//Creamos schema para nuestro modelo
var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

//Exportamos el modelo con el nombre de user
/*Al usar el schema usamos un objeto user con los
valores que hemos dado al schema*/
module.exports = mongoose.model('User', UserSchema);