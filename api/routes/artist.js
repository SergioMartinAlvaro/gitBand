"use strict"

var express = require('express');
var multipart = require('connect-multiparty');
var ArtistController = require('../controllers/artist.js');
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({uploadDir: './uploads/artists'});
var api = express.Router();

api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/saveArtist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/getImageArtist/:imageFile',ArtistController.getImageFile);

module.exports = api;