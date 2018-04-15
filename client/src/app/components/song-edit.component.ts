import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { Song } from '../models/song';

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public alertMessage: string;
	public is_edit;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _uploadService: UploadService,
		private _userService: UserService,
		private _songService: SongService
	) {
		this.titulo = 'Editar cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(0,'','','','');
		this.is_edit = true;
	}

	ngOnInit(){
		console.log('album-edit.component.ts cargado');
		//Llamar al metodo del api para sacar un artista en base a su id getArtist
		this.getSong();
	}

	getSong(){
		//Llama al metodo del servicio
		//Crea un array con todos los parametros
		this._route.params.forEach((params: Params) => {
			//Id de url
			let id = params['id'];
			//Llama al servicio
			this._songService.getSong(this.token, id).subscribe(
				response => {
					//Objeto de la peticion ajax
					this.song = response.song;

					if(!response.song) {
						this.alertMessage = "No se ha podido obtener la cancion.";
					} else {
						this.song = response.song;
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
			this._songService.editSong(this.token, id, this.song).subscribe(
				response => {
					if(!response.song) {
						this.alertMessage = "Error en el servidor";
					} else {
						this.alertMessage = "La cancion se ha actualizado correctamente";
						//Subir fichero cancion
						this._uploadService.makeFileRequest(this.url+'upload-song-file/'+id,[],this.filesToUpload,this.token,'file').then(
							(result) => {
								//this._router.navigate(['/editar-tema',this.song.album._id]);
								this.getSong();
								this.alertMessage = "Cancion editada correctamente";
							},
							(error) => {
								console.log(error);
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

	public filesToUpload : Array<File>;
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}