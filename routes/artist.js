"use strict"

var express = require('express');
var multipart = require('connect-multiparty');
var ArtistController = require('../controllers/artist.js');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/saveArtist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);

module.exports = api;