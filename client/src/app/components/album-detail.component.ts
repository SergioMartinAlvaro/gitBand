import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album'
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {
	public titulo: string;
	private album: Album;
	private albums: Album[];
	public songs: Song[];
	public identity;
	public token;
	public url: string;
	public alertMessage: string;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private  _albumService: AlbumService,
		private _songService: SongService
	) {
		this.titulo = 'Datos del artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');
		//Llamar al metodo del api para sacar un artista en base a su id getArtist
		//Sacar albums del artista
		this.getAlbum();
	}

	getAlbum(){
		//Llama al metodo del servicio
		//Crea un array con todos los parametros
		this._route.params.forEach((params: Params) => {
			//Id de url
			let id = params['id'];
			//Llama al servicio
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					//Objeto de la peticion ajax
					this.album = response.album;

					if(!response.album) {
						this._router.navigate(['/']);
					} else {
						this.album = response.album;
						//Sacar los datos del album
						this._songService.getSongs(this.token, response.album._id).subscribe(
							response => {
								if(!response.songs) {
									this.alertMessage = "Este album no tiene canciones";
								} else {
									this.songs = response.songs;
								}
							},
							error => {
								var errorMessage = <any>error;

								if(errorMessage != null) {
									var body = JSON.parse(error._body);
									this.alertMessage = body.message;
									console.log(error);
								}
							}
						)
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null) {
						var body = JSON.parse(error._body);
						this.alertMessage = body.message;
						console.log(error);
					}
				}
			);
		});
	}

	public confirmado;
	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelSong() {
		this.confirmado = null;
	}
	
	onDeleteSong(id) {
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if(!response.song) {
					this.alertMessage = "Error en el servidor"
				}
				this.getAlbum();
			},
			error => {
				var errorMessage = <any>error;
				if(errorMessage != null) {
					var body = JSON.parse(error._body);
					this.alertMessage = body.message;
					console.log(error);
				}
			}
		);
	}
}