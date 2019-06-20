import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase.service';
import { WordService } from '../shared/services/word.service';
import { GameService } from '../shared/services/game.service';
import { NotificationsService } from '../shared/services/notifications.service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit, OnDestroy {
  seasonId: number = -1;
  episodeId: number = -1;
  languageKey: string = 'en';

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
    this.backend.getEpisode(this.seasonId, this.episodeId)
      .subscribe(
        (response)=>{
          const data = response.json();
          this.wordService.allWords = data.words;
          this.gameService.setGrids(data.grid);
          this.gameService.seasonId = this.seasonId;
          this.gameService.episodeId = this.episodeId;
        }
      )

    //this.notificationSrv.gameSaved().subscribe(
    //);
  }

  ngOnDestroy() {

  }

}
