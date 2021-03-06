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
    this.wordSrv.changeInLanguage.subscribe(
      (newLang: string)=>{
        this.language = newLang;

        if (!this.episode['grid'][this.language] || this.episode['grid'][this.language].length < 1) {
          // this.generateGameGrid();
        } else {
          this.gameGrid = this.episode['grid'][this.language];
        }
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
    console.log('word', word);

    // if (caca['used']) {
      //this.notificationsSrv.word.next('Word alredy used.');
      //return;
    // }

    if (word) {
      const prevState = this.wordSrv.getPreviousState();
      console.log('prev state', prevState);
      if (prevState) {
        prevState.forEach((item)=>{
          this.gameGrid[item['row']][item['col']] = item['label'];
        });
      }
      const wordForSplit = word.toUpperCase().split('');
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

}
