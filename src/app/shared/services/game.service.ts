import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameGrids: any;
	activeGrid: any;
	gridChanged = new Subject();

  constructor() {
    
  }

	getGameGrid(langKey: string) {
		console.log('this game grid', this.gameGrids[langKey]);
		return this.activeGrid;
	}

	setGrids(grids: any){
		console.log('this was set!', grids);
		this.gameGrids = grids;
		this.gridChanged.next(this.gameGrids);
	}
}
