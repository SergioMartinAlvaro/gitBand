//Interactua con los metodos del api del usuario
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

//Para poder inyectar el componente en otras clase
@Injectable()
//Podemos exportar y utilizar la clase
export class UserService {
	
	//Guardaremos la url de nuestra api/rest
	public url: string;
	public identity;
	public token;

	//Nos permite usar Http y todos sus metodos
	constructor(private _http: Http) {
		//Da el valor que hemos configurado a la url
		this.url = GLOBAL.url;
	}

	//Metodo para el login con usuario a loguear y un hash a null
	signup(user_to_login, gethash = null) {
		if(gethash != null) {
			user_to_login.gethash = gethash;
		}

		let json = JSON.stringify(user_to_login);
		//json a string
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		//el metodo devuelve una respuesta a la peticion http que incluye los params y la cabecera
		//Esta respuesta se mapea y se llama mediante callback para que sea un objeto json
		return this._http.post(this.url+'login', params, {headers: headers}).map(res => res.json());
	}

	//Devuelve el objeto identity de la session storage
	getIdentity() {
		//Hacemos del item un objeto js
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != 'undefined') {
			this.identity = identity;
		} else {
			this.identity = null;
		}

		return this.identity;
	}

	//Devuelve el objeto token de la session storage
	getToken() {
		let token = JSON.parse(localStorage.getItem('token'));
		if(token) {
			this.token = token;
		} else {
			this.token = null;
		}

		return this.token;
	}

}