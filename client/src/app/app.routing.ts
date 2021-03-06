//<!-- Fichero de rutas basicas -->

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { AppComponent } from './app.component';
import {UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';
import {ArtistListComponent} from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

//array con todas nuestras configuraciones de rutas

const appRoutes: Routes = [
	//Para esta ruta cargamos este componente, unimos las dos partes
	{path: 'artists/:page', component: ArtistListComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: 'crear-artista', component: ArtistAddComponent},
	{path: 'ver-artista/:id', component: ArtistDetailComponent},
	{path: 'editar-artista/:id', component: ArtistEditComponent},
	{path:'crear-album/:artist', component: AlbumAddComponent},
	{path: 'editar-album/:id', component: AlbumEditComponent},
	{path: 'album/:id', component: AlbumDetailComponent},
	{path: 'crear-tema/:album', component: SongAddComponent},
	{path: 'editar-tema/:id', component: SongEditComponent},
	{path: '**', component: HomeComponent},
	{path: '', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);