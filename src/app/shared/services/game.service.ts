import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Response } from '@angular/http';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from './firebase.service';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameGrids: any;
	activeGrid: any;
	activeSeason: number;
	activeEpisode: number;
	gridChanged = new Subject();
  rows: number = 11;
  cols: number = 16;

  constructor(
		private backendSrv: FirebaseService,
		private notificationSrv: NotificationsService) {
	}

	get seasonId() { return this.activeSeason; }
	set seasonId(value: number) { this.activeSeason = value; }

	get episodeId() { return this.activeEpisode; }
	set episodeId(value: number) { this.activeEpisode = value; }

	get gameGrid() { return this.activeGrid; }
	set gameGrid(grid: any) {
		this.activeGrid = grid;
	}

	setGrids(grids: any, languageKey: string = 'en'){
		['en','es'].forEach((lang)=>{
			if (!grids[lang]) {
				grids[lang] = this.generateGameGrid();
			}
		});
		this.gameGrids = grids;
		this.activeGrid = grids[languageKey];
		this.gridChanged.next(this.activeGrid);
	}

	save() {
		this.backendSrv.saveGames(this.activeSeason, this.activeEpisode, this.gameGrids).subscribe(
			(response: Response) => {
				this.notificationSrv.gameSaved.next('shaved!!');
			}
		);
	}

	setActiveGrid(languageKey: string) {
		this.activeGrid = this.gameGrids[languageKey];
		this.gridChanged.next(this.activeGrid);
	}

	resetGrid(languageKey: string) {
		this.gameGrids[languageKey] = this.generateGameGrid();
		this.gridChanged.next(this.gameGrids[languageKey]);
		// TODO need to clean up the words
	}

  generateGameGrid() {
		let blankGrid = [];
    for (let i=0 ; i<this.rows ; i++ ) {
      blankGrid.push([]);
      for (let j=0 ; j<this.cols ; j++ ) {
        blankGrid[i][j] = {
          label: this.getRandomLetter(),
          classes: []
        };
      }
		}
		return blankGrid;
	}
	
  getRandomLetter() {
    return String.fromCharCode(Math.floor( Math.random()*(90-65) )+65);
  }
}
