"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	//Guarda el id de otro objeto creado en la bbdd, en este caso un artista
	artist: {type: Schema.ObjectId, ref: "Artist"}
});

module.exports = mongoose.model('Album', AlbumSchema);