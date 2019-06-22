export class WordModel {
	constructor(
		public label: string,
		public bgColor: string,
		public fontColor: string,
		public dirty: boolean,
		public active: boolean ) {}
}