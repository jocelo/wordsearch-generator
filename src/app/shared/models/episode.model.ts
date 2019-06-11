import { WordModel } from "./word.model";

export class EpisodeModel {

	constructor(
		private id: number,
		private title: string,
		private en: string,
		private es: string,
		private diff: string,
		private words: WordModel[],
		private grid: {
			'en': [],
			'es': []
		}
	) {}
}