"use strict"

var User = require('../models/user.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.js')

/* Metodo que recibe req y res */
function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con node y mongo'
	})
}

//Metodo que registrara usuarios
function saveUser(req, res) {
	//Instancia del modelo de usuario
	var user = new User({});

	//Recogemos parametros
	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	//Encriptamos la password
	if(params.password) {
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null) {
				//Guardamos el usuario
				user.save((err, userStored) => {

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

function loginUser(req, res) {
	//Recogemos lo que nos llegue por post
	var params = req.body;
	var email = params.email;
	var password = params.password;
	//Buscamos el usuario en la base de 
	/* Contiene una funcion callback ya que devuelve o un usuario
	o un error */
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err) {
			res.status(500).send({message: "Error en la peticion"});
		} else {
			if(!user) {
				res.status(404).send({message: "Username not in database"});
			} else {
				//Comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check) {
					if(check) {
						//Devuelve datos del usuario logueado
						if(params.gethash) {
							//Devolvemos un token de JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});
						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message: "Login Incorrect"});
					}
				});
			}
		}
	});
}

function updateUser(req, res) {

	//recogemos el id del usuario
	var userId = req.params.id;
	var update = req.body;
	
	//Actualizamos los datos del usuario dado un id
	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err) {
			res.status(500).send({message: "Failed to update user, server error."});
		} else {
			if(!userUpdated) {
				res.status(404).send({message: "Failed to update user, user not found."})
			} else {
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res) {

	//Recibimos un user id
	var userId = req.params.id;
	//nombre de fichero por defecto
	var file_name = "No subido";
	//Comprobamos si hay fichero en la request
	if(req.files) {
		//Recogemos el nombre que esta entre las barras
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		//Extraemos la extension
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//Comprobamos que es una imagen
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'JPEG') {
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				console.log(userId);
				if(err) {
					res.status(500).send({message: "Failed to connect to server"});
				} else {
					if(!userUpdated) {
						res.status(404).send({message: "Unable to update the user image"});
					} else {
						res.status(200).send({user: userUpdated});
					}
				}
				
			});
		} else {
			res.status(200).send({message: "Invalid file extension."});
		}
	} else {
		res.status(200).send({message: "Image not uploaded, try again."})
	}
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage
};