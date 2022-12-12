import User from './User';

export default abstract class Space {
	id: number;
	readonly name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

export class Start extends Space {
	constructor() {
		super(0, 'Início');
	}
}

export class Prison extends Space {
	constructor() {
		super(10, 'Prisão');
	}
}

export class Vacation extends Space {
	constructor() {
		super(20, 'Férias');
	}
}

export class Arrestment extends Space {
	constructor() {
		super(30, 'Camburão');
	}
}

export class Taxes extends Space {
	constructor({ id }: { id: number }) {
		super(id, 'Dia de pagar impostos');
	}
}

export class Payment extends Space {
	constructor({ id }: { id: number }) {
		super(id, 'Dia do pagamento');
	}
}

abstract class Property extends Space {
	owner: User | null = null;

	constructor(id: number, name: string) {
		super(id, name);
	}
}

export class Building extends Property {
	houses: number = 0;
	limit: number;
	rent: number;
	fee: number;

	constructor({ id, name, rent, limit = 5, fee = 10 }: { id: number, name: string, rent: number, limit?: number, fee?: number }) {
		super(id, name);

		this.limit = limit;
		this.rent = rent;
		this.fee = fee;
	}
}

export class Enterprise extends Property {
	price: number;

	constructor({ id, name, price }: { id: number, name: string, price: number }) {
		super(id, name);

		this.price = price;
	}
}

export class Event extends Space {
	constructor({ id }: { id: number }) {
		super(id, 'Sorte ou Azar');
	}
}

export enum SpaceTypes {
	BUILDING,
	ENTERPRISE,
	EVENT,
}