'use strict'

var file = require('fs');
var path = require('path');
//Traemos la libreria que nos permitira paginar
var mongoosePaginate = require('mongoose-pagination');
//Importamos el modelo del artista
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {

	var artistId = req.params.id;
	Artist.findById(artistId, (err, artist) => {
		if(err) {
			req.status(500).send({message: "Error getting artist."})
		} else {
			if(!artist) {
				req.status(404).send({message: "Artist doesnt exist in database"});
			} else {
				res.status(200).send({artist});
			}
		}
	})
}

function saveArtist(req,res) {

	var artist = new Artist();
	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err) {
			res.status(500).send({message: "Error saving artist."});
		} else {
			if(!artistStored) {
				res.status(404).send({message: "Artist doesnt saved."});
			} else {
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

function getArtists(req, res) {
	//Recoge la paginacion
	if(req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	//Artistas por pagina
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
		if(err) {
			res.status(500).send({message: "Request error."});
		} else {
			if(!artists) {
				res.status(404).send({message: 'No artists created in database'})
			} else {
				return res.status(200).send({
					total_items: total,
					artists: artists
				})
			}
		}
	});
}

function updateArtist(req, res) {

	var artistId = req.params.id;
	var update = req.body;
	Artist.findByIdAndUpdate(artistId, update, function(err, artistUpdated){
		if(err) {
			res.status(500).send({message: "Request error updating artist."});
		} else {
			if(!artistUpdated) {
				res.status(404).send({message: "Artist not found in database."});
			} else {
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

//Borra a un artista y borra todos sus datos asociados
function deleteArtist(req, res) {

	var artistId = req.params.id;
	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err) {
			res.status(500).send({message: "Request Error removing artist."})
		} else {
			if(!artistRemoved) {
				res.status(404).send({message: "Artist not found."})
			} else {
				//Extrae los albumes que le corresponden al artista borrado y los borra
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if(err) {
						res.status(500).send({message: "Request Error removing albums."});
					} else {
						if(!albumRemoved) {
							res.status(404).send({message: "Album not found"});
						} else {
							//Extrae las canciones del album borrado y las borra
							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => { 
								if(err) {
									res.status(500).send({message: "Request Error removing songs."});
								} else {
									if(!songRemoved) {
										res.status(404).send({message: "Songs not found"});
									} else {
										res.status(200).send({artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(err) {
					res.status(500).send({message: "Failed to connect to server"});
				} else {
					if(!artistUpdated) {
						res.status(404).send({message: "Unable to update the artist image"});
					} else {
						res.status(200).send({artist: artistUpdated});
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
	var path_file = './uploads/artists/' + imageFile;
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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}