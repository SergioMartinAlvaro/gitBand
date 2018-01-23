"use strict"

var file = require('fs');
var path = require('path');
//Traemos la libreria que nos permitira paginar
var mongoosePaginate = require('mongoose-pagination');
//Importamos el modelo del artista
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
	var songId = req.params.id;
	Song.findById(songId, (err, song) => {
		if(err) {
			res.status(500).send({message: 'Request invalid.'});
		} else {
			if(!song) {
				res.status(404).send({message: 'Song not found in database.'});
			} else {
				res.status(200).send({song});
			}
		}
	})
}

function getSongs(req, res) {

	var albumId = req.params.album;

	if(!albumId) {
		//Si no se le da un id de usuario saca todos de la bbdd
		var find = Song.find({}).sort('title');
	} else {
		//Busca las canciones del album
		var find = Song.find({album: albumId}).sort('year');
	}

	//Le indicamos que filtre por album
	find.populate({path: 'album'}).exec((err, songs) =>{
		if(err) {
			res.status(500).send({message: "Request invalid"});
		} else {
			if(!songs) {
				res.status(404).send({message: 'This album hasnt got any song'})
			} else {
				res.status(200).send({songs});
			}
		}
	});
}

function saveSong(req, res) {
	var params = req.body;
	var song = new Song();
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save((err, songStored) => {
		if(err) {
			res.status(500).send({message: "Request invalid."});
		} else {
			if(!songStored) {
				res.status(404).send({message: "Song not stored in database"});
			} else {
				res.status(200).send({song: songStored});
			}
		}
	});
}

function deleteSong(req, res) {
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songDeleted) => {
		if(err) {
			res.status(500).send({message: "Request invalid."});
		} else {
			if(!songDeleted) {
				res.status(404).send({message: "Song not found in database"});
			} else {
				res.status(200).send({song: songDeleted});
			}
		}
	});
}

function updateSong(req, res) {
	var songId = req.params.id;
	var update = req.body;
	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err) {
			res.status(500).send({message: "Request invalid."});
		} else {
			if(!songUpdated) {
				res.status(404).send({message: "Song not found in database"});
			} else {
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

function uploadSong(req, res) {

	var songId = req.params.id;
	var file_name = "No subido...";

	if(req.files) {
		//Recogemos el nombre que esta entre las barras
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		//Extraemos la extension
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//Comprobamos que es una imagen
		if(file_ext == 'wmv' || file_ext == 'mp3' || file_ext == '3gp' || file_ext == 'ogg') {
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if(err) {
					res.status(500).send({message: "Failed to connect to server"});
				} else {
					if(!songUpdated) {
						res.status(404).send({message: "Unable to update the song file"});
					} else {
						res.status(200).send({song: songUpdated});
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

function getSongFile(req, res){
	//La imagen llega por la url
	var songFile = req.params.file;
	var path_file = './uploads/songs/' + songFile;
	//Comprobamos que el fichero existe
	file.exists(path_file, function(exists) {
		//Si existe devolvemos el fichero
		if(exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({message: "File not found."})
		}
	});
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	deleteSong,
	updateSong,
	uploadSong,
	getSongFile
}