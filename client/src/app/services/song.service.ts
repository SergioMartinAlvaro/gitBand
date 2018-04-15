//Interactua con los metodos del api del usuario
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Song } from '../models/song';
import { Album } from '../models/album';

//Para poder inyectar el componente en otras clase
@Injectable()
//Podemos exportar y utilizar la clase
export class SongService {
	
	//Guardaremos la url de nuestra api/rest
	public url: string;

	//Nos permite usar Http y todos sus metodos
	constructor(private _http: Http) {
		//Da el valor que hemos configurado a la url
		this.url = GLOBAL.url;
	}

	addSong(token, song: Song){
		let params = JSON.stringify(song);
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.post(this.url+'saveSong', params,{headers : headers}).map(res => res.json());

	}

	getSong(token, id:string) {
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.get(this.url+'song/'+id,{headers : headers}).map(res => res.json());
	}

	editSong(token, id:string, song:Song) {
		let params = JSON.stringify(song);
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});
		return this._http.put(this.url+'update-song/'+id, params,{headers : headers}).map(res => res.json());
	}

	getSongs(token, albumId = null) {
		//Cabeceras de la peticion con el formato de la info dada y la autorizacion
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		if(albumId == null) {
			return this._http.get(this.url+'songs',{headers : headers}).map(res => res.json());
		} else {
			return this._http.get(this.url+'songs/'+albumId,{headers : headers}).map(res => res.json());
		}
	}

	deleteSong(token, id:string) {
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization':token
		});

		return this._http.delete(this.url+'delete-song/'+id,{headers : headers}).map(res => res.json());
	}
}