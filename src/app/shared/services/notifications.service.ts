import { Subject } from 'rxjs';

export class NotificationsService {
	direction: Subject<string>;
	word: Subject<string>;
	game: Subject<object>;
	categories: Subject<string>;
	gameSaved: Subject<string>;

	constructor() {
		this.direction = new Subject();
		this.word = new Subject();
		this.game = new Subject();
		this.categories = new Subject();
		this.gameSaved = new Subject();
	}
}