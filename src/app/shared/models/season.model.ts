import { EpisodeModel } from "./episode.model";

export class SeasonModel {
	constructor(
		private id: number,
		private title: string,
		private en: string,
		private es: string,
		private episodes: EpisodeModel[] ) {}
}