
export default class Pawn {
	color: string;
	space: number;
	moving: boolean;

	constructor(color: string, space: number, moving: boolean) {
		this.color = color;
		this.space = space;
		this.moving = moving;
	}
}
