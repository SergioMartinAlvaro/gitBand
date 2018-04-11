import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album'
import { Artist } from '../models/artist';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {
	public titulo: string;
	private album: Album;
	private albums: Album[];
	public identity;
	public token;
	public url: string;
	public alertMessage: string;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private  _albumService: AlbumService
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


	
}