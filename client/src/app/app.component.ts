import { Component, OnInit } from '@angular/core';
import { User } from "./models/user";
//Importamos el servicio
import { UserService } from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //Cargamos los servicios que queramos
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'SERGIOTY-FY';
  public user: User;
  public user_register: User;
  //guarda al usuario logueado
  public identity;
  public token;
  public errorMessage;
  public message;

  //Asigna valores a las propiedades de la clase
  constructor( private _userService:UserService) {
  	this.user = new User('','','','','','ROLE_USER','');
  	this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit() {
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  }

  public onSubmit() {

  	this.clearMessages();
  	//Nos subscribimos al observer y recogemos datos de usuarios
  	this._userService.signup(this.user).subscribe(
  		response => {

  			let identity = response.user;
  			this.identity = identity;
  			if(!this.identity._id) {
  				alert("User not correctly logued");
  			} else {
  				//Creado localStorage para tener usuario en sesion, identity de json a string
  				localStorage.setItem('identity', JSON.stringify(identity));
  				this._userService.signup(this.user, 'true').subscribe (
  					response => {
  						let token = response.token;
			  			this.token = token;
			  			console.log(response);

			  			if(this.token.length <= 0){
			  				alert("Token not generated");
			  			} else {
			  				//Sesion en localStorage con el token (ya es un string)
			  				localStorage.setItem('token',token);
			  				this.user = new User('','','','','','ROLE_USER','');

			  			}
		  			}
  				)
	  			
  			}

  		},
  		error => {
  			var errorMessage = <any>error;

  			if(errorMessage != null) {
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  			}
  		}
  	);
  }

  logout() {
    //Eliminamos solo al usuario
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
  	//Elimina toda la sesion
  	localStorage.clear();
  	//Cerramos la sesion visualmente y volvemos a los formularios
  	this.token = null;
  	this.identity = null;
  	this.user = new User('','','','','','ROLE_USER','');

  }

  public onSubmitRegister() {

  	this.clearMessages();
  	this._userService.register(this.user_register).subscribe(
  		response => {

  			let user = response.user;
  			this.user_register = user;
  			if(!this.user_register._id || !this.user_register.surname || !this.user_register.name || 
  			!this.user_register.password || !this.user_register.email) {
  				this.errorMessage = "User not correctly registered";
  			} else {
  				this.message = "User correctly registered";
  				this.user_register = new User('','','','','','ROLE_USER','');
	  			
  			}

  		},
  		error => {
  			var errorMessage = <any>error;

  			if(errorMessage != null) {
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  				console.log(error);
  			}
  		}
  	);
  }

  private clearMessages() {
  	this.message = null;
  	this.errorMessage = null;
  }

}
