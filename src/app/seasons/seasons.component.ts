import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SeasonModel } from '../shared/models/season.model';
import { EpisodeModel } from '../shared/models/episode.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.css']
})
export class SeasonsComponent implements OnInit {
  showAddSeason: boolean = false;
  showAddEpisode: boolean = false;
  showAddWord: boolean = false;
  seasons: SeasonModel[];
  episodes: EpisodeModel[];
  activeSeason: SeasonModel;
  activeEpisode: EpisodeModel;
  activeWordList: any;
  selectedSeason: number = -1;
  selectedEpisode: number = -1;
  alertMsg: string = '';
  showSeasonAlert: boolean = false;
  showEpisodeAlert: boolean = false;
  showWordAlert: boolean = false;

  @ViewChild('enWordInput') wordInput: ElementRef;

  constructor(
    private backendSrv: FirebaseService,
    private router: Router ) { }

  ngOnInit() {
    this.backendSrv.getDB()
      .subscribe(
        (data) => {
          this.seasons = data.json();
        }
      );
  }

  onSelectSeason(seasonId: number) {
    this.hideAllAddForms();
    this.selectedSeason = seasonId;
    this.activeSeason = this.seasons[seasonId];
    this.episodes = this.activeSeason['episodes'];
  }

  onSelectEpisode(episodeId: number) {
    this.hideAllAddForms();
    this.selectedEpisode = episodeId;
    this.activeEpisode = this.activeSeason['episodes'][episodeId];
    if (!this.activeEpisode['words']) {
      this.activeEpisode['words'] = {'en':[], 'es':[]}
    }

    this.activeWordList = this.activeEpisode['words'];
  }

  onEditEpisode(episodeId: number) {
    console.log('will be edited!!');
  }

  addNewSeason() { this.showAddSeason = true; }
  addNewEpisode() { this.showAddEpisode = true; }
  addNewWord() { this.showAddWord = true; }

  onSaveNewSeason(form: NgForm) {
    const entry = new SeasonModel(
      190401,
      form.value.catTitle,
      form.value.catEn,
      form.value.catEs,
      []
    );

    this.backendSrv.saveNewSeason(entry)
      .subscribe(
        (response: Response) => {
          this.triggerAlert('season');
          this.seasons = response.json();
          form.reset();
          this.showAddSeason = false;
        },
        (error) => console.log('something massive happened!')
      );
  }

  onSaveNewEpisode(gameForm: NgForm) {
    if (!this.activeSeason['episodes']) {
      this.activeSeason['episodes'] = [];
    }

    this.activeSeason['episodes'].push(new EpisodeModel(
      14040101,
      gameForm.value.epiTitle,
      gameForm.value.epiEn,
      gameForm.value.epiEs,
      'normal',
      { en:[], es:[] },
      [[]]
    ));

    this.backendSrv.saveGame(this.seasons)
      .subscribe((response: Response)=>{
        this.triggerAlert('episode');
      });
  }

  onSaveNewWord(wordForm: NgForm) {
    this.activeEpisode['words']['en'].push(wordForm.value.wordEn);
    this.activeEpisode['words']['es'].push(wordForm.value.wordEs);
    
    this.backendSrv.saveGame(this.seasons)
      .subscribe((response: Response)=>{
        this.triggerAlert('word');
        wordForm.reset();
        this.wordInput.nativeElement.focus();
      });
  }

  onOpenEpisode() {
    this.router.navigate(['/designer', this.selectedSeason, this.selectedEpisode]);
  }

  onCancel() {
    this.showAddSeason = false;
    this.showAddEpisode = false;
    this.showAddWord = false;
  }

  private triggerAlert(type: string) {
    if (type === 'episode') {
      this.showEpisodeAlert = true;
      this.alertMsg = 'Episode saved!';
    } else if (type === 'season') {
      this.showSeasonAlert = true;
      this.alertMsg = 'Season saved!';
    } else if (type === 'word') {
      this.showWordAlert = true;
      this.alertMsg = 'Word Combination saved!';
    }

    setTimeout(()=>{
      this.showSeasonAlert = false;
      this.showEpisodeAlert = false;
      this.showWordAlert = false;
    }, 2500);
  }
  
  private hideAllAddForms() {
    this.showAddSeason = false;
    this.showAddEpisode = false;
    this.showAddWord = false;
  }
}
