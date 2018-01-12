"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta_gitBand";

//codifica los datos de la respuesta
exports.createToken = function(user) {
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.name,
		password: user.password,
		role: user.role,
		image: user.image,
		//fecha de creacion
		iat: moment().unix(),
		//Expiracion del usuario
		exp: moment().add(30, 'days').unix

	};

	return jwt.encode(payload, secret);
}