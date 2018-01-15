'use strict'

var file = require('fs');
var path = require('path');
//Importamos el modelo del artista
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
	res.status(200).send({message: "Metodo getArtist correcto"});
}

module.exports = {
	getArtist
}