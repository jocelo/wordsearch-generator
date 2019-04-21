export class WordModel {
	constructor(
		public es: string,
		public en: string,
		public bgColor: string,
		public fontColor: string,
		public touched: boolean,
		public dirty: boolean,
		public active: boolean ) {}
}