import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameGrids: any;
  activeGrid: any;

  constructor() {
    
  }

	getGameGrid(langId: number) {
		console.log('this game grid', this.gameGrids[langId]);
		return this.activeGrid;
	}

	setGrid(langId: number, grid: any){
		this.gameGrids[langId] = grid;
	}
}
