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
						'words': {
							'en': [
								{ 'label': 'red', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'blue', 'bgColor':'rgba(255,255,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'green', 'bgColor':'rgba(0,255,255,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'yellow', 'bgColor':'rgba(255,125,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'purple', 'bgColor':'rgba(0,255,125,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'orange', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'gray', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'white', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'black', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'brown', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false }
							],
							'es': [
								{ 'label': 'rojo', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'azul', 'bgColor':'rgba(255,255,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'verde', 'bgColor':'rgba(0,255,255,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'amarillo', 'bgColor':'rgba(255,125,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'morado', 'bgColor':'rgba(0,255,125,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'naranja', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'gris', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'blanco', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'negro', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false },
								{ 'label': 'cafe', 'bgColor':'rgba(255,0,0,0.5)' , 'fontColor':'rgba(255, 255, 255, 1)', 'dirty': false, 'active': false }
							]
						},
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
	
	// todo, remove hardcoded values
	saveSeason(game: SeasonModel[], seasonId: number, episodeId: number) {
		return this.http.put(`https://word-search-933f0.firebaseio.com/seasons/${seasondId}/episode/${episodeId}.json`, game);
	}

	saveGame(wholeGame) {
		return this.http.put(`https://word-search-933f0.firebaseio.com/seasons.json`, wholeGame);
	}
	
	// todo remove hardcoded values
	saveGames(seasonId:number = -1, episodeId: number = -1, grid: any) {
		console.log('grid', grid);
		console.log('url', `https://word-search-933f0.firebaseio.com/seasons/${seasonId}/episodes/${episodeId}/grid.json`);
		return this.http.put(`https://word-search-933f0.firebaseio.com/seasons/${seasonId}/episodes/${episodeId}/grid.json`, grid);
	}

	saveWords(seasonId:number = -1, episodeId: number = -1, words: any) {
		console.log('!!saveWords!!', words);
		return this.http.put(`https://word-search-933f0.firebaseio.com/seasons/${seasonId}/episodes/${episodeId}/words.json`, words);
	}

	saveNewSeason(newSeason: SeasonModel) {
		return this.http.put(`https://word-search-933f0.firebaseio.com/seasons.json`, [...this.cached, newSeason]);
	}

	deleteSeason(idx: number) {
		this.cached.splice(idx, 1);
		/*
		this.saveGame(this.cached).subscribe(
			(response: Response) => {
				this.cached = response.json();
				this.refreshCachedData.next(this.cached);
			}
		);
		*/
	}
}