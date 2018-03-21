//Interactua con los metodos del api del usuario
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

//Para poder inyectar el componente en otras clase
@Injectable()
//Podemos exportar y utilizar la clase
export class ArtistService {
	
	//Guardaremos la url de nuestra api/rest
	public url: string;

	//Nos permite usar Http y todos sus metodos
	constructor(private _http: Http) {
		//Da el valor que hemos configurado a la url
		this.url = GLOBAL.url;
	}

	addArtist(token, artist: Artist){
		let params = JSON.stringify(artist);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveArtist', params,{headers:headers}).map(res => res.json());

	}

}