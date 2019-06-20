import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Response } from '@angular/http';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from './firebase.service';

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

	setGrids(grids: any, languageKey: string = 'en'){
		this.gameGrids = grids;
		this.activeGrid = grids[languageKey];
		this.gridChanged.next(this.activeGrid);
	}
	// now this method should take care of updating the newly selected word and apply 
	// the word into the grid
	// once that is done, we just need to sumbmit the observable.next so
	// our front end catched up the change and can react to it
	// nothing has been saved yet... saving function will be taken care later
	// I' pretty sure with all this the logic will be cleaner
	// and less dependencies will exists
	set gameGrid(grid: any) {
		console.log('what the actual fuck', grid);
		this.activeGrid = grid;
	}
	/*
	updateGrid(grid: any){
		console.log('save grid change');
		this.activeGrid = grid;
		// no need to notify the front again... the change is already done in the grid in store-front
		debugger;
	}
	*/

	setActiveGrid(languageKey: string) {
		this.activeGrid = this.gameGrids[languageKey];
		this.gridChanged.next(this.activeGrid);
	}

	resetGrid(languageKey: string) {
		this.gameGrids[languageKey] = this.generateGameGrid();
		this.gridChanged.next(this.gameGrids[languageKey]);
	}

  private generateGameGrid() {
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
