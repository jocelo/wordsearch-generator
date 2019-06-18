import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { SeasonModel } from "../models/season.model";
import { Observable, Subject } from "rxjs";

@Injectable()
export class FirebaseService {
	cached: SeasonModel[];
	refreshCachedData = new Subject();

	constructor(private http: Http) {
		this.http.get('https://word-search-933f0.firebaseio.com/seasons.json')
			.subscribe(
				(response: Response)=>{
					this.cached = response.json();
				}
			)
	}

	restoreGameDB() {
		// season id= 2 digits year + 1 digits month + 2 digits consecutive number
		// episode id= season id + 2 digits consecutive number
		return this.http.put('https://word-search-933f0.firebaseio.com/seasons.json', [
			{
				'id': 190401,
				'title': 'colors',
				'en': 'Colors',
				'es': 'Colores',
				'episodes': [
					{
						'id': 19040101,
						'title': 'basic_colors',
						'en': 'Basic Colors',
						'es': 'Colores Basicos',
						'diff': 'normal',
						'words': [
							{ 'en': 'red', 'es': 'rojo', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'blue', 'es': 'azul', 'bgColor':'rgba(255,255,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'green', 'es': 'verde', 'bgColor':'rgba(0,255,255,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'yellow', 'es': 'amarillo', 'bgColor':'rgba(255,125,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'purple', 'es': 'morado', 'bgColor':'rgba(0,255,125,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'orange', 'es': 'naranja', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'gray', 'es': 'gris', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'white', 'es': 'blanco', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'black', 'es': 'negro', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false },
							{ 'en': 'brown', 'es': 'cafe', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'touched': false, 'dirty': false, 'active': false }
						],
						'grid': {
							'en': '',
							'es': ''
						} 
					}
				]
			}
		]);
	}

	getDB() {
		return this.http.get('https://word-search-933f0.firebaseio.com/seasons.json');
	}

	getEpisode(seasonId: number, episodeId: number) {
		return this.http.get(`https://word-search-933f0.firebaseio.com/seasons/${seasonId}/episodes/${episodeId}.json`);
	}

	getDBForDesigner(seasonId: number, episodeId: number) {
		return this.http.get('https://word-search-933f0.firebaseio.com/seasons.json');
	}
	
	saveGame(game: SeasonModel[]) {
		return this.http.put('https://word-search-933f0.firebaseio.com/seasons/1/episode/2.json', game);
	}

	saveNewSeason(newSeason: SeasonModel) {
		return this.saveGame([newSeason, ...this.cached]);
	}

	deleteSeason(idx: number) {
		this.cached.splice(idx, 1);
		this.saveGame(this.cached).subscribe(
			(response: Response) => {
				this.cached = response.json();
				this.refreshCachedData.next(this.cached);
			}
		);
	}
}