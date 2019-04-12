import { Component, OnInit, Input } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private wordSrv: WordService, 
    private toolSrv: ToolsService,
    private notificationsSrv: NotificationsService,
    private backend: FirebaseService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const seasonId = this.route.snapshot.params.season;
    const episodeId = this.route.snapshot.params.episode;
    let grid;
    let ddt;

    this.backend.getEpisode()
      .subscribe(
        (response: Response ) => {
          grid = response.json();
          console.log('caca caca', grid[seasonId]['episodes'][episodeId]);
          
          if (grid[seasonId]['episodes'][episodeId]['grid'] && grid[seasonId]['episodes'][episodeId]['grid']['en'].length >0) {
            this.gameGrid = grid[seasonId]['episodes'][episodeId]['grid']['en'].map(letters=>{
              return letters.split('').map((letter)=>{
                return {
                  label: letter,
                  ahhuevo: false,
                  classes: []
                }
              })
            });

          } else {
            console.log('need to generate a new grid');
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
          console.log('this is the game grid', grid);
        }
      );
        /*
      console.log('need to generate a new grid');
      for (let i=0 ; i<this.rows.length ; i++ ) {
        this.gameGrid.push([]);
        for (let j=0 ; j<this.cols.length ; j++ ) {
          this.gameGrid[i][j] = {
            label: this.getRandomLetter(),
            classes: []
          };
        }
      }
      console.log(' >>> ', this.gameGrid);
*/
    console.log('generated grid > ', this.gameGrid);
  }

  getRandomLetter() {
    return String.fromCharCode(Math.floor( Math.random()*(90-65) )+65);
  }

  onCellClicked(sRow: number, sCol:number) {
    const word = this.wordSrv.getSelected();
    const caca = this.wordSrv.getWholeSelected();
    const direction = this.toolSrv.getDirection();

    if (!direction) {
      this.notificationsSrv.direction.next('You need to select a direction.');
      return;
    }

    if (!word) {
      this.notificationsSrv.word.next('You need to select a word from the list.');
      return;
    }

    if (caca['used']) {
      //this.notificationsSrv.word.next('Word alredy used.');
      //return;
    }

    if (word) {
      const prevState = this.wordSrv.getPreviousState();
      if (prevState) {
        prevState.forEach((item)=>{
          this.gameGrid[item['row']][item['col']] = item['label'];
        });
      }
      const wordForSplit = word.split('');
      let nextCoord = {
        row: sRow,
        col: sCol
      };

      for (let i = 0 ; i < word.length ; i++ ) {
        this.wordSrv.savePreviousState(nextCoord.row, nextCoord.col, this.gameGrid[nextCoord.row][nextCoord.col]);
        this.gameGrid[nextCoord.row][nextCoord.col] = {
          label: wordForSplit.shift(),
          classes: [''],
          shit: caca['bgColor']
        }
        nextCoord = this.getNextCoord(nextCoord, direction);
      }
    } // if a word is selected 

    this.wordSrv.setGrid(this.gameGrid);

    this.wordSrv.markAsUsed();

  } // onCellClicked

  private getNextCoord(coord: {row: number, col: number}, direction: string): {row: number, col:number}{
    let nextRow: number = coord.row,
      nextCol: number = coord.col;
    switch(direction) {
      case 'north':
        nextRow--;
        break;
      case 'northeast':
        nextRow--;
        nextCol++;
        break;
      case 'east':
        nextCol++;
        break;
      case 'southeast':
        nextRow++;
        nextCol++;
        break;
      case 'south':
        nextRow++;
        break;
      case 'southwest':
        nextRow++;
        nextCol--;
        break;
      case 'west':
        nextCol--;
        break;
      case 'northwest':
        nextRow--;
        nextCol--;
        break;
      default:
        break;
    }

    return {
      row: nextRow,
      col: nextCol
    }
  }
}
