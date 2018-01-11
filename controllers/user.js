"use strict"

var User = require('../models/user.js');
var bcrypt = require('bcrypt-nodejs');

/* Metodo que recibe req y res */
function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con node y mongo'
	})
}

//Metodo que registrara usuarios
function saveUser(req, res) {
	//Instancia del modelo de usuario
	var user = new User();

	//Recogemos parametros
	var params = req.body;
	console.log(params);
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	//Encriptamos la password
	if(params.password) {
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null) {
				//Guardamos el usuario
				user.save((err, userStored) => {
									console.log("llego aqui");
					if(err) {
						res.status(500).send({message: "System failed to save the user"});
					} else {
						if(!userStored){
							res.status(404).send({message: "User not registered"});
						} else {
							//Devuelve el objeto si este se ha guardado bien
							res.status(200).send({user: userStored});
						}
					}
				});
			} else {
				res.status(200).send({message: "All fields are required"});
			}
		});
	} else {
		res.status(200).send({message: "Introduce a valid password"});
	}
}

module.exports = {
	pruebas,
	saveUser
};