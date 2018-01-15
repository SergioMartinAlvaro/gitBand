"use strict"

var express = require('express');
var multipart = require('connect-multiparty');
var ArtistController = require('../controllers/artist.js');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);

module.exports = api;