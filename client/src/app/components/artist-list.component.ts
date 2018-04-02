import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.html',
	providers: [UserService, ArtistService],
})

export class ArtistListComponent implements OnInit {
	public titulo: string;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	//Paginacion
	public next_page;
	public prev_page;

	constructor(
		//Recoge las rutas
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService
	) {
		this.titulo = 'Artistas';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit(){
		console.log('artist-list.component.ts cargado');

		//Conseguir listado de artistas
		this.getArtists();
	}

	getArtists(){
		//Recoge datos de la url
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page){
				page = 1;
			} else {
				this.next_page = page+1;
				this.prev_page = page-1;

				if(this.prev_page == 0) {
					this.prev_page = 1;
				}
			}

			this._artistService.getArtists(this.token, page).subscribe(
				response => {
					if(!response.artist) {
						this._router.navigate(["/"]);
					} else {
						this.artists = response.artist;
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null){
						var body = JSON.parse(error._body);
						console.log(error);
					}
				}
			);

		});
	}
}