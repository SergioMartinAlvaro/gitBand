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
			res.status(500).send({message: "Request error."});
		} else {
			if(!artistUpdated) {
				res.status(404).send({message: "Artist not found in database."});
			} else {
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist
}