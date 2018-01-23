"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta_gitBand";

exports.ensureAuth = function(req, res, next) {
	//Recogemos la autorizacion
	if(!req.headers.authorization) {
		return res.status(403).send({message: "Request have not authentication header"});
	}
	//Eliminamos comillas del token
	var token = req.headers.authorization.replace(/['"]+/g, '');
	//Decodificamos el token
	try{
		//Decodificamos pasando el token y la clave
		var payload = jwt.decode(token, secret);
		//Saber si el token ha expirado
		if(payload.exp <= moment.unix()){
			return res.status(401).send({message: "Expired token"});
		}
	} catch(ex) {
		console.log(ex);
		return res.status(404).send({message: "Invalid token"});
	}

	req.user = payload;

	next();
};
