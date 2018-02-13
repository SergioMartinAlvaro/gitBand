//<!-- Fichero de rutas basicas -->

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import {UserEditComponent } from './components/user-edit.component';

//array con todas nuestras configuraciones de rutas

const appRoutes: Routes = [
	//Para esta ruta cargamos este componente, unimos las dos partes
	{path: '', component: UserEditComponent},
	{path: 'mis-datos', component: UserEditComponent},
	{path: '**', component: UserEditComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);