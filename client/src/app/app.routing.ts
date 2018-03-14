//<!-- Fichero de rutas basicas -->

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import {UserEditComponent } from './components/user-edit.component';

import {ArtistListComponent} from './components/artist-list.component';

//array con todas nuestras configuraciones de rutas

const appRoutes: Routes = [
	//Para esta ruta cargamos este componente, unimos las dos partes
	{path: '', component: ArtistListComponent},
	{path: 'artist/:page', component: ArtistListComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: '**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);