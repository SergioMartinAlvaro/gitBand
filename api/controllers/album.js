'use strict'

var file = require('fs');
var path = require('path');
//Traemos la libreria que nos permitira paginar
var mongoosePaginate = require('mongoose-pagination');
//Importamos el modelo del artista
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
	var albumId = req.params.id;
	Album.findById(albumId, (err, album) => {
		if(err) {
			res.status(500).send({message: 'Request invalid.'});
		} else {
			if(!album) {
				res.status(404).send({message: 'Album not found in database.'});
			} else {
				res.status(200).send({album});
			}
		}
	})

}

function saveAlbum(req, res) {
	var params = req.body;
	var album = new Album();

	album.title = params.title;
	album.year = params.year;
	album.image = 'null';
	album.description = params.description;
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err) {
			res.status(500).send({message: 'Request invalid.'});
		} else {
			if(!albumStored) {
				res.status(404).send({message: 'Album not stored in database.'});
			} else {
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function getAlbums(req, res) {

	var artistId = req.params.artist;

	if(!artistId) {
		//Si no se le da un id de usuario saca todos de la bbdd
		var find = Album.find({}).sort('title');
	} else {
		//Busca los albumes del artista
		var find = Album.find({artist: artistId}).sort('year');
	}

	//Le indicamos que filtre por artista
	find.populate({path: 'artist'}).exec((err, albums) =>{
		if(err) {
			res.status(500).send({message: "Request invalid"});
		} else {
			if(!albums) {
				res.status(404).send({message: 'This artist hasnt got any album'})
			} else {
				res.status(200).send({albums});
			}
		}
	});
}

function updateAlbum(req, res) {

	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err) {
			res.status(500).send({message: "Request invalid."});
		} else {
			if(!albumUpdated) {
				res.status(404).send({message: 'Album not found in database'})
			} else {
				res.send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res) {
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if(err) {
			res.status(500).send({message: "Request invalid"});
		} else {
			if(!albumRemoved) {
				res.status(404).send({message: "Album not found in database"});
			} else {
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
					if(err) {
						res.status(500).send({message: "Request invalid"});
					} else {
						if(!songRemoved) {
							res.status(404).send({message: "No songs found in database"});
						} else {
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}

		}
	});
}

function uploadImage(req, res) {

	var albumId = req.params.id;
	var file_name = "No subido...";

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
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
				if(err) {
					res.status(500).send({message: "Failed to connect to server"});
				} else {
					if(!albumUpdated) {
						res.status(404).send({message: "Unable to update the album image"});
					} else {
						res.status(200).send({album: albumUpdated});
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

function getImageFile(req, res){
	//La imagen llega por la url
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/' + imageFile;
	//Comprobamos que el fichero existe
	file.exists(path_file, function(exists) {
		//Si existe devolvemos el fichero
		if(exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({message: "Image not found."})
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}