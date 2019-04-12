export class EpisodeModel {

	constructor(
		private id: number,
		private title: string,
		private en: string,
		private es: string,
		private difficulty: string,
		private words: {
			en: string[],
			es: string[]
		},
		private grid: string[][]
	) {}
}