import { Subject } from 'rxjs';

export class NotificationsService {
	direction: Subject<string>;
	word: Subject<string>;
	game: Subject<string>;
	categories: Subject<string>;

	constructor() {
		this.direction = new Subject();
		this.word = new Subject();
		this.game = new Subject();
		this.categories = new Subject();
	}
}