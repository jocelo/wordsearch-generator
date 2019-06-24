import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase.service';
import { WordService } from '../shared/services/word.service';
import { GameService } from '../shared/services/game.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit, OnDestroy {
  seasonId: number = -1;
  episodeId: number = -1;
  episode: string = '';
  season: string = '';
  wordsLen: number;
  languageKey: string = 'en';
  gameSavedObs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private wordService: WordService,
    private gameService: GameService,
    private notificationSrv: NotificationsService,
    private backend: FirebaseService ) { 
    this.seasonId = this.route.snapshot.params.season;
    this.episodeId = this.route.snapshot.params.episode;
  }

  ngOnInit() {
    this.backend.getSeason(this.seasonId)
      .subscribe(
        (response)=>{
          const data = response.json();
          this.wordService.allWords = data.episodes[this.episodeId].words;
          this.gameService.setGrids(data.episodes[this.episodeId].grid);
          this.gameService.seasonId = this.seasonId;
          this.gameService.episodeId = this.episodeId;
          this.season = data.en;
          this.episode = data.episodes[this.episodeId].en;
          this.wordsLen = data.episodes[this.episodeId].words.length;
        }
      )

      this.gameSavedObs = this.notificationSrv.gameSaved.subscribe(
        (data) => {
          console.log('!!!!'+data);
          // TODO make the animation from saving overlay here
          // show the overlay with the status
        }
      );

    //this.notificationSrv.gameSaved().subscribe(
    //);
  }

  ngOnDestroy() {
    //this.gameSavedObs.unsubscribe();
  }

}
