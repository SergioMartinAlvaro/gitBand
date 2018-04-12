import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Song } from '../models/song';
import { Album } from '../models/album';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, AlbumService, SongService]
})

export class SongAddComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage: string;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService,
		private _albumService: AlbumService
	) {
		this.titulo = 'Añadir nueva cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(0,'','','','');
	}

	ngOnInit(){
		console.log('song-add.component.ts cargado');
	}
	
	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let album_id = params["album"];
			this.song.album = album_id;

			this._songService.addSong(this.token, this.song).subscribe(
			response => {
				if(!response.song) {
					this.alertMessage = "Error en el servidor";
				} else {
					this.alertMessage = "La cancion se ha creado correctamente";
					this.song = response.song;
					this._router.navigate(['/editar-tema', response.song._id]);
				}
			},
			error => {
				var errorMessage = <any>error;

				if(errorMessage != null) {
					var body = JSON.parse(error._body);
					this.alertMessage = "Error en la creacion del album.";
					console.log(error);
				}
			}
		);
	});
		
	}
	
}