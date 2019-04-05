import { Component, OnInit, Input } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  rows: string[] = Array(11);
  cols: string[] = Array(16);
  gameGrid: any = [];
  wordsGrid: string[];

  constructor(private wordSrv: WordService, private toolSrv: ToolsService) { }

  ngOnInit() {
    for (let i=0 ; i<this.rows.length ; i++ ) {
      this.gameGrid.push([]);
      for (let j=0 ; j<this.cols.length ; j++ ) {
        this.gameGrid[i][j] = {
          label: this.getRandomLetter(),
          classes: []
        };
      }
    }
  }

  getRandomLetter() {
    return String.fromCharCode(Math.floor( Math.random()*(90-65) )+65);
  }

  onCellClicked(sRow: number, sCol:number) {
    const word = this.wordSrv.getSelected();
    const direction = this.toolSrv.getDirection();

    if (word) {
      const prevState = this.wordSrv.getPreviousState();
      if (prevState) {
        prevState.forEach((item)=>{
          this.gameGrid[item.row][item.col] = item.label;
        });
      }

      const wordForSplit = word.split('');

      // neet to know the direction of the positioning
      
      console.log('we are going where?', direction);
      // GOING EAST... 
      if ( direction === 'east' ) {
        for (let col=sCol ; col<(sCol+word.length-1) ; col++) {
          this.wordSrv.savePreviousState(sRow, col, this.gameGrid[sRow][col]);
          this.gameGrid[sRow][col] = {
            label: wordForSplit.shift(),
            classes: ['redbg']
          }
        }
      } else if ( direction === 'south' ) {
        for (let row=sRow ; row<(sRow+word.length-1) ; row++) {
          this.wordSrv.savePreviousState(row, sCol, this.gameGrid[row][sCol]);
          this.gameGrid[row][sCol] = {
            label: wordForSplit.shift(),
            classes: ['redbg']
          }
        }
      }
      
    } // if a word is selected 

  } // onCellClicked
}
