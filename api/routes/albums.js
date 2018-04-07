"use strict"

var express = require('express');
var multipart = require('connect-multiparty');
var AlbumController = require('../controllers/album.js');
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({uploadDir: './uploads/albums'});
var api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/saveAlbum', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);


module.exports = api
