import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { AlbumService } from '../services/album.service';
import { UserService } from '../services/user.service';
import { Album } from '../models/album';

@Component({
	selector: 'album-list',
	templateUrl: '../views/album-add.html',
	providers: [UserService, AlbumService]
})

export class AlbumListComponent implements OnInit {
	public titulo: string;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage: string;
	public is_edit;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService
	) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('','',2018,'','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('album-list.component.ts cargado');
		//Llamar al metodo del api para sacar un artista en base a su id getArtist
		this.getAlbums();
	}

	getAlbums(){
		//Llama al metodo del servicio
		//Crea un array con todos los parametros
		this._route.params.forEach((params: Params) => {
			//Id de url
			let id = params['id'];
			//Llama al servicio
			this._albumService.getAlbums(this.token, id).subscribe(
				response => {
					//Objeto de la peticion ajax
					this.album = response.album;

					if(!response.album) {
						this.alertMessage = "No se han podido obtener los albums.";
					} else {
						this.album = response.album;
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null) {
						var body = JSON.parse(error._body);
						this.alertMessage = 'Error al intentar obtener el album.';
					}
				}
			);
		});
	}

	onSubmit() {
		this._route.params.forEach((params: Params) => {
			let id = params["id"];
			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				response => {
					if(!response.album) {
						this.alertMessage = "Error en el servidor";
					} else {
						this.alertMessage = "El album se ha actualizado correctamente";
						//Subir imagen album

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