//<!-- Fichero de rutas basicas -->

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { AppComponent } from './app.component';
import {UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';
import {ArtistListComponent} from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';

//array con todas nuestras configuraciones de rutas

const appRoutes: Routes = [
	//Para esta ruta cargamos este componente, unimos las dos partes
	{path: 'artists/:page', component: ArtistListComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: 'crear-artista', component: ArtistAddComponent},
	{path: '**', component: HomeComponent},
	{path: '', component: HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);