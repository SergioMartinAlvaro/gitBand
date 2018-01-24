//Exportamos una clase para usarla en otro modelo
export class User{
	//Definimos el constructor del modelo
	constructor(
		public _id: string,
		public name: string,
		public surname: string,
		public email: string,
		public password: string,
		public role: string,
		public image: string
	){}
}