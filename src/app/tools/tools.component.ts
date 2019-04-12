import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { SeasonModel } from '../shared/models/season.model';
import { EpisodeModel } from '../shared/models/episode.model';
import { WordModel } from '../shared/models/word.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit  {
  wordsList: object[] = [];
  db: any;

  //@ViewChild('newWord') newWord: ElementRef;
  //@ViewChild('gameName') gameName: ElementRef;
  
  previousSelected: any;
  wordSelected: string;
  wordsAlertMessage: string;
  toolsAlertMessage: string;
  gameAlertMessage: string;
  selectedW: number = -1;
  seasonId: number = -1;
  episodeId: number = -1;
  game: SeasonModel[];
  season: SeasonModel;
  episode: EpisodeModel;
  grid: [string[]];

  constructor(
    private wordSrv: WordService,
    private route: ActivatedRoute,
    private notificationsSrv: NotificationsService,
    private backend: FirebaseService) { }

  ngOnInit() {
    this.wordsAlertMessage = '';
    this.toolsAlertMessage = '';
    this.gameAlertMessage = '';
    this.wordsList = this.wordSrv.getWords();
    this.seasonId = this.route.snapshot.params.season;
    this.episodeId = this.route.snapshot.params.episode;

    this.backend.getDB()
      .subscribe(
        (response: Response) => {
          this.game = response.json();
          this.season = this.game[this.seasonId];
          this.episode = this.season['episodes'][this.episodeId];

          this.episode['words']['en'].forEach((word)=>{
            this.wordSrv.addWord(word);
          });
          this.wordsList = this.wordSrv.getWords();
          console.log('this.episode', this.episode);
          if (this.episode['grid']) {
            console.log('edit mode!!');
            this.grid = [[]];
          }
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
      this.gameAlertMessage = msg;
      setTimeout(()=>{
        this.gameAlertMessage = '';
      }, 2500);
    });
  }
  /*
  onAddWord() {
    const newWord = String(this.newWord.nativeElement.value).trim();
    if (newWord) {
      this.wordSrv.addWord(newWord);
    }
  }
  
  onKeyUp(event: any) {
    if (event.code === 'Enter') {
      this.onAddWord();
      this.newWord.nativeElement.select();
    }
  }
  */

  onSelectWord(word: WordModel, idx: number) {
    this.wordSrv.setSelected(word.label, idx);
    this.selectedW = idx;
  }

  /*
  onGenerate() {
    if ( this.gameName.nativeElement.value.trim() === '' ) {
      console.log('inside');
      this.notificationsSrv.game.next('Specify a name for the game.');
    } else if ( this.wordSrv.allWordsUsed() ) {
      // this.gameString = JSON.stringify( this.wordSrv.generateStructure() );
    } else {
      this.notificationsSrv.word.next('Please use all words before continue.');
    }
  }
  */

  onSaveGrid() {
    console.log('caca', this.wordSrv.generateStructure());
    const gameGenerated = this.wordSrv.generateStructure();
    
    this.episode['grid'] = {
      'en': gameGenerated.game
    };

    console.log('!', this.game);
    
    this.backend.saveGame(this.game)
      .subscribe(
        (response: Response)=> { console.log(response); }
      );
  }

  onResetDB() {
    if (confirm("Are you sure to reset DB to it's original state?")) {
      this.backend.restoreGameDB()
        .subscribe(
          (response: Response) => {
            this.notificationsSrv.game();
            console.log('DB cleaned!!'); 
          }
        );
    }
  }

}
