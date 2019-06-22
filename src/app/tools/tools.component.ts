import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { SeasonModel } from '../shared/models/season.model';
import { EpisodeModel } from '../shared/models/episode.model';
import { WordModel } from '../shared/models/word.model';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit, OnDestroy {
  words: WordModel[] = [];

  //@ViewChild('newWord') newWord: ElementRef;
  //@ViewChild('gameName') gameName: ElementRef;
  
  previousSelected: any;
  wordSelected: string;
  wordsAlertMessage: string;
  toolsAlertMessage: string;
  gameAlertMessage: string;
  selectedWordIdx: number = -1;
  mainLang: string = 'en';
  secondLang: string = 'es';
  langSwitch: {};

  constructor(
    private wordSrv: WordService,
    private toolSrv: ToolsService,
    private gameSrv: GameService,
    private notificationsSrv: NotificationsService,
    private backend: FirebaseService) { }

  ngOnInit() {
    this.wordsAlertMessage = '';
    this.toolsAlertMessage = '';
    this.gameAlertMessage = '';

    this.langSwitch = {};
    this.langSwitch[this.mainLang] = this.secondLang;
    this.langSwitch[this.secondLang] = this.mainLang;

    /*
    this.backend.getDB()
      .subscribe(
        (response: Response) => {
          this.game = response.json();
          
          this.season = this.game[this.seasonId];
          this.episode = this.season['episodes'][this.episodeId];
          this.grid = this.episode['grid'][this.mainLang];
          this.wordSrv.setGrid(this.grid);
          this.wordSrv.cleanWordList();

          this.wordsList = this.episode['words'];
          this.wordSrv.addWords(this.episode['words']);
        }
      );
    */

    this.wordSrv.wordsObs.subscribe(
      (wordsList: WordModel[]) => {
        this.words = wordsList;
      }
    );
    
    this.notificationsSrv.direction.subscribe((msg)=>{
      this.toolsAlertMessage = msg;
      setTimeout(()=>{
        this.toolsAlertMessage = '';
      }, 2500);
    });
    this.notificationsSrv.word.subscribe((msg)=>{
      this.wordsAlertMessage = msg;
      setTimeout(()=>{
        this.wordsAlertMessage = '';
      }, 2500);
    });
    this.notificationsSrv.game.subscribe((msg)=>{
      this.gameAlertMessage = msg[1];
      setTimeout(()=>{
        this.gameAlertMessage = '';
      }, 2500);
    });

    this.wordSrv.markWordAsUsed.subscribe(
      (response: object) => {
        this.words[response['idx']]['dirty'] = true;
        this.words[response['idx']]['start'] = {row: response['row'], col: response['col']};
        this.words[response['idx']]['direction'] = this.toolSrv.getDirection();
      }
    );
  }

  ngOnDestroy() {
    
  }

  onSelectWord(word: WordModel, idx: number) {
    this.wordSrv.setSelected(word[this.mainLang], idx);
    this.selectedWordIdx = idx;
  }

  onChangeLanguage(newLang: string) {
    this.mainLang = newLang;
    this.secondLang = this.langSwitch[newLang];
    this.gameSrv.setActiveGrid(newLang);
  }

  onSaveGrid() {
    this.gameSrv.save();
    this.backend.saveWords(this.gameSrv.seasonId, this.gameSrv.episodeId, this.wordSrv.getWords).subscribe(
      (response: Response) => {
        const data = response.json();
      }
    );
  }

  onResetGrid() {
    if (confirm('Reset grid to clean state?')) {
      this.gameSrv.resetGrid('en');
      this.wordSrv.resetWords();
    }
  }

}
