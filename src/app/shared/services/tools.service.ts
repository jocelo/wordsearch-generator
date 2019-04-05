export class ToolsService {
	private direction: string = 'east';

	setDirection(newDirection: string) {
		this.direction = newDirection;
	}

	getDirection() {
		return this.direction;
	}
}