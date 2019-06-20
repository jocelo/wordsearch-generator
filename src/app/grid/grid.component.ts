import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { EpisodeModel } from '../shared/models/episode.model';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnDestroy {
  rows: string[] = Array(11);
  cols: string[] = Array(16);
  gameGrid: any = [];
  wordsGrid: string[];
  episode: EpisodeModel;
  language: string;

  constructor(
    private wordSrv: WordService, 
    private toolSrv: ToolsService,
    private gameSrv: GameService,
    private notificationsSrv: NotificationsService,
    private backend: FirebaseService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const seasonId = this.route.snapshot.params.season;
    const episodeId = this.route.snapshot.params.episode;
    let grid;
    console.log('init en el grid component... si es el segundo, ya sabemos cual es el grid');
    // console.log('', this.wordSrv.getGameGrid());

    // this will be removed
    /*
    this.backend.getEpisode()
      .subscribe(
        (response: Response ) => {
          grid = response.json();
          this.language = this.wordSrv.getLanguage();
          this.episode = grid[seasonId]['episodes'][episodeId];
          this.gameGrid = this.episode['grid'][this.language];

          if (this.episode['grid'][this.language].length == 0) {
            this.generateGameGrid();
          }
          // this.wordSrv.setGrid(this.gameGrid);
        }
      );
    */
      
    this.wordSrv.changeInLanguage.subscribe(
      (newLang: string)=>{
        this.language = newLang;
        console.log('second detection!!! > ', newLang, '<', this.language);
        console.log( this.episode['grid'][this.language] );
        if (!this.episode['grid'][this.language] || this.episode['grid'][this.language].length < 1) {
          this.generateGameGrid();
        } else {
          console.log( this.episode['grid'][this.language] );
          this.gameGrid = this.episode['grid'][this.language];
        }
        console.log('after the change::', this.episode);
      }
    );

    this.gameSrv.gridChanged.subscribe(
      (grid) => {
        this.gameGrid = grid;
      }
    );
  }

  ngOnDestroy() {
    this.wordSrv.changeInLanguage.unsubscribe();
    this.gameSrv.gridChanged.unsubscribe();
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

    if ( this.outOfBounds(word.length, sCol, sRow, direction) ) {
      this.notificationsSrv.game.next({1:'Nel no cabe'});
      return;
    }

    console.log('caca', caca);

    // if (caca['used']) {
      //this.notificationsSrv.word.next('Word alredy used.');
      //return;
    // }

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
          bgColor: caca['bgColor']
        }
        nextCoord = this.getNextCoord(nextCoord, direction);
      }
    } // if a word is selected 

    this.gameSrv.gameGrid = this.gameGrid;
    this.wordSrv.markAsUsed(sCol, sRow);

  } // onCellClicked

  private outOfBounds(wordSize: number, col: number, row: number, direction: string) {
    console.log('direction', direction);
    if (direction.indexOf('east') != -1 && wordSize+col > 16) {
      return true;
    }

    if (direction.indexOf('south') != -1 && wordSize+row > 11) {
      return true;
    }

    if (direction.indexOf('west') != -1 && col-wordSize < -1) {
      return true;
    }

    if (direction.indexOf('north') != -1 && row-wordSize < -1) {
      return true;
    }

    return false;
  }

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

  private generateGameGrid() {
    this.gameGrid = [];
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
}
