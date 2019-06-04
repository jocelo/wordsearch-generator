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
  selectedWordIdx: number = -1;
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
          this.wordSrv.cleanWordList();

          this.wordsList = this.episode['words'];
          this.wordSrv.addWords(this.episode['words']);
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

    this.wordSrv.markWordAsUsed.subscribe(
      (response: number) => {
        this.episode['words'][response]['dirty'] = true;
      }
    );
  }

  onSelectWord(word: WordModel, idx: number) {
    this.wordSrv.setSelected(word.en, idx);
    this.selectedWordIdx = idx;
  }

  onSaveGrid() {
    const gameGenerated = this.wordSrv.generateStructure();

    console.log('this game', this.game);
    /*
    this.episode['grid'] = {
      'en': gameGenerated.game
    };
    */
    
    this.backend.saveGame(this.game)
      .subscribe(
        (response: Response)=> { console.log(response); }
      );
  }

  onResetGrid() {
    if (confirm('Reset grid to clean state?')) {

    }
  }

}
