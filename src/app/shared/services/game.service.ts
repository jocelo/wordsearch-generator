import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameGrids: any;
	activeGrid: any;
	gridChanged = new Subject();
  rows: number = 11;
  cols: number = 16;

  constructor() {
    
  }

	getGameGrid(langKey: string) {
		console.log('this game grid', this.gameGrids[langKey]);
		return this.activeGrid;
	}

	setGrids(grids: any, languageKey: string = 'en'){
		this.gameGrids = grids;
		this.gridChanged.next(this.gameGrids[languageKey]);
	}

	setGrid(grid: any, languageKey: string){
		this.gameGrids[languageKey] = grid;
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
