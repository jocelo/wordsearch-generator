export class WordModel {
	constructor(
		public label: string,
		public bgColor: string,
		public fontColor: string,
		public active: boolean,
		public used: boolean,
		public dirty: boolean ) {}
}