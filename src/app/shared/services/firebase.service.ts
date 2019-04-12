import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { SeasonModel } from "../models/season.model";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseService {
	cached: SeasonModel[];
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
						'dificulty': 'normal',
						'words': {
							'en': ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'gray', 'white', 'black', 'brown'],
							'es': ['rojo', 'azul', 'verde', 'amarillo', 'morado', 'naranja', 'gris', 'blanco', 'negro', 'cafe']
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

	getEpisode() {
		return this.http.get('https://word-search-933f0.firebaseio.com/seasons.json');
	}

	getDBForDesigner(seasonId: number, episodeId: number) {
		return this.http.get('https://word-search-933f0.firebaseio.com/seasons.json');
	}
	
	saveGame(game: SeasonModel[]) {
		return this.http.put('https://word-search-933f0.firebaseio.com/seasons.json', game);
	}
	
	saveWord() {
		console.log('save this new word');
	}

	saveNewSeason(newSeason: SeasonModel) {
		return this.saveGame([newSeason, ...this.cached]);
	}

	addCategory(category: any) {
		return this.http.put('https://word-search-933f0.firebaseio.com/seasons.json',[{uno:1, dos:2}, {tres:3, cuatro:4}]);
	}
}