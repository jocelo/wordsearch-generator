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
	gridChanged = new Subject();
  rows: number = 11;
  cols: number = 16;

  constructor(
		private backendSrv: FirebaseService,
		private notificationSrv: NotificationsService) {
    
  }

	getGameGrid(langKey: string) {
		console.log('this game grid', this.gameGrids[langKey]);
		return this.activeGrid;
	}

	setGrids(grids: any, languageKey: string = 'en'){
		this.gameGrids = grids;
		this.gridChanged.next(this.gameGrids[languageKey]);
	}
	// the idea here is to save ni a different methodn
	// method below shold only take care of keeping the grid updated
	// and once the used decides to save
	// we will easily retrieve the gameGrid active, and it[s current state
	// and leave the actual backend saving to another method
	// which by they way might have nothing to do with this one 
	setGrid(grid: any, languageKey: string){
		this.gameGrids[languageKey] = grid;
		this.backendSrv.saveGrid(1,2,'en',grid).subscribe(
			(response: Response) => {
				const data = response.json();
				console.log('coming back from saving', data);
			}
		);
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
