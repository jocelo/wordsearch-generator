import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  rows: string[] = Array(11);
  cols: string[] = Array(16);
  gameGrid: any = [];

  constructor() { }

  ngOnInit() {
    console.log(this.gameGrid);

    for (let i=0 ; i<this.rows.length ; i++ ) {
      this.gameGrid.push([]);
      for (let j=0 ; j<this.cols.length ; j++ ) {
        this.gameGrid[i][j] = {
          label: this.getRandomLetter(),
          classes: []
        };
      }
    }
    console.log('init:', this.gameGrid);
  }

  getRandomLetter() {
    return String.fromCharCode(Math.floor( Math.random()*(90-65) )+65);
  }

}
