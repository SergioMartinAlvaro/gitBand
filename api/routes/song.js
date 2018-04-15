"use strict"

var express = require('express');
var multipart = require('connect-multiparty');
var SongController = require('../controllers/song.js');
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({uploadDir: './uploads/songs'});
var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/saveSong', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadSong);
api.get('/get-song-file/:file', SongController.getSongFile);


module.exports = api
