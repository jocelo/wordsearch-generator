import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase.service';
import { WordService } from '../shared/services/word.service';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit {
  seasonId: number = -1;
  episodeId: number = -1;
  languageKey: string = 'en';

  constructor(
    private route: ActivatedRoute,
    private wordService: WordService,
    private gameService: GameService,
    private backend: FirebaseService ) { 
    this.seasonId = this.route.snapshot.params.season;
    this.episodeId = this.route.snapshot.params.episode;
  }

  ngOnInit() {
    this.backend.getEpisode(this.seasonId, this.episodeId)
      .subscribe(
        (response)=>{
          const data = response.json();
          console.log('responded ??', data);
          this.wordService.wordsObs.next(data.words);
          this.gameService.setGrids(data.grid);
        }
      )
  }

}
