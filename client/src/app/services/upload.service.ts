//Interactua con los metodos del api del usuario
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

//Para poder inyectar el componente en otras clase
@Injectable()
//Podemos exportar y utilizar la clase
export class UploadService {
	
	//Guardaremos la url de nuestra api/rest
	public url: string;

	//Nos permite usar Http y todos sus metodos
	constructor(private _http: Http) {
		//Da el valor que hemos configurado a la url
		this.url = GLOBAL.url;
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>, token:string, name:string){

		return new Promise(function(resolve, reject){
		//Simula funcionamiento de formulario
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest();

			//Recorremos los ficheros que nos llegan
			for(var i = 0; i < files.length; i++) {
				formData.append(name, files[i], files[i].name);
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