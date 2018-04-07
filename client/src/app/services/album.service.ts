//Interactua con los metodos del api del usuario
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

//Para poder inyectar el componente en otras clase
@Injectable()
//Podemos exportar y utilizar la clase
export class AlbumService {
	
	//Guardaremos la url de nuestra api/rest
	public url: string;

	//Nos permite usar Http y todos sus metodos
	constructor(private _http: Http) {
		//Da el valor que hemos configurado a la url
		this.url = GLOBAL.url;
	}

	addAlbum(token, album: Album){
		let params = JSON.stringify(album);
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveAlbum', params,{headers : headers}).map(res => res.json());

	}

	getAlbum(token, id: string) {
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.get(this.url+'album/'+id,{headers : headers}).map(res => res.json());
	}

	editAlbum(token, id: string, album: Album) {
		let params = JSON.stringify(album);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'update-album/'+id,params,{headers: headers}).map(res => res.json());
	}

	getAlbums(token, id = null) {
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		let options = new RequestOptions({headers:headers});

		if(id == null) {
			return this._http.get(this.url+'albums', options).map(res => res.json());
		} else {
			return this._http.get(this.url+'albums/'+id, options).map(res => res.json());
		}
	}
}