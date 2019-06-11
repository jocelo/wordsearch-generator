export class ToolsService {
	private direction: string = 'east';

	setDirection(newDirection: string) {
		console.log('set direction', newDirection)
		this.direction = newDirection;
	}

	getDirection() {
		return this.direction;
	}
}