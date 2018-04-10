import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album'
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
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
		private _artistService: ArtistService,
		private  _albumService: AlbumService
	) {
		this.titulo = 'Datos del artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('artist-detail.component.ts cargado');
		//Llamar al metodo del api para sacar un artista en base a su id getArtist
		this.getArtist();

		//Sacar albums del artista
	}

	getArtist(){
		//Llama al metodo del servicio
		//Crea un array con todos los parametros
		this._route.params.forEach((params: Params) => {
			//Id de url
			let id = params['id'];
			//Llama al servicio
			this._artistService.getArtist(this.token, id).subscribe(
				response => {
					//Objeto de la peticion ajax
					this.artist = response.artist;

					if(!response.artist) {
						this._router.navigate(['/']);
					} else {
						this.artist = response.artist;
						//Sacar los datos del artista
						this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response => {
								if(!response.albums) {
									this.alertMessage = "Este artista no tiene albums";
								} else {
									this.albums = response.albums;
								}
							},
							error => {
								var errorMessage = <any>error;

								if(errorMessage != null) {
									var body = JSON.parse(error._body);
									this.alertMessage = "Error al cargar los albums";
								}
							}
						);
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
	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelAlbum(){
		this.confirmado = null;
	}

	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response => {
				if(!response.album) {
					this.alertMessage = "Error en el servidor al borrar el album";
				} else {
					this.alertMessage = "Album borrado correctamente.";
				}
				this.getArtist();
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