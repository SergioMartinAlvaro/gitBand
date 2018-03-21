import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UserService]
})

export class UserEditComponent implements OnInit{
	public titulo: string;
	public user:User;
	public identity;
	public token;
	public alertMessage;
	public url:string;

	constructor(
		private _userService:UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		//LocalStorage
		this.identity = this._userService.getIdentity();
  		this.token = this._userService.getToken();
  		this.titulo = "Actualizar mis datos";
		this.user = this.identity;
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		
	}

	onSubmit() {
		this._userService.updateUser(this.user).subscribe(
			response => {
				if (!response.user) {
					this.alertMessage = "User not updated, system error.";
				} else {
					localStorage.setItem('identity', JSON.stringify(this.user));
					document.getElementById('identity_name').innerHTML = this.user.name;
					if(!this.filesToUpload) {

					} else {
						//llamamos a la peticion ajax
						this.makeFileRequest(this.url+ 'upload-image-user/'+this.user._id, [], this.filesToUpload).then((result:any) => {
							//Recogemos el resultado de la peticion ajax y actualizamos el localStorage
							this.user.image = result.image;
							localStorage.setItem('identity', JSON.stringify(this.user));
							let image_path = this.url + 'get-image-user/' + this.user.image;
							document.getElementById('image-logged').setAttribute('src', image_path);
							console.log(this.user);

						});
					}
					this.alertMessage = "User updated.";
				}
			},
			error => {
				var alertMessage = error;
				if (alertMessage != null) {
					var body = JSON.parse(error._body);
					this.alertMessage = body.message;

					console.log(error);
				}
			}
		);
	}

	public filesToUpload: Array<File>;

	//Recibimos informacion de ficheros target
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	//Realiza peticion ajax al servidor
	makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		var token = this._userService.getToken();

		return new Promise(function(resolve, reject){
		//Simula funcionamiento de formulario
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			//Recorremos los ficheros que nos llegan
			for(var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);
			}

			//Comprobamos que la peticion esta lista
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4) {
					//Comprobamos que se nos devuelve un estado 200
					if(xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}

				}
			}
			//Peticion post a la url
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);

			
		});
	}
}