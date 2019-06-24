import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';
import { SeasonModel } from '../shared/models/season.model';
import { EpisodeModel } from '../shared/models/episode.model';
import { Router } from '@angular/router';
import { NotificationsService } from '../shared/services/notifications.service';
import { WordModel } from '../shared/models/word.model';
import { WordService } from '../shared/services/word.service';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.css']
})
export class SeasonsComponent implements OnInit, OnDestroy {
  showAddSeason: boolean = false;
  showAddEpisode: boolean = false;
  showAddWord: boolean = false;
  seasons: SeasonModel[];
  episodes: EpisodeModel[];
  activeSeason: SeasonModel;
  activeEpisode: EpisodeModel;
  activeWordList: any;
  secondWordList: any;
  activeWord: any;
  selectedSeason: number = -1;
  selectedEpisode: number = -1;
  selectedWord: number = -1;
  alertMsg: string = '';
  showSeasonAlert: boolean = false;
  showEpisodeAlert: boolean = false;
  showWordAlert: boolean = false;
  alertType: string = 'alert-success';

  editMode: boolean = false;

  @ViewChild('enWordInput') wordInput: ElementRef;
  @ViewChild('seasonForm') seasonForm: NgForm;
  @ViewChild('episodeForm') episodeForm: NgForm;
  @ViewChild('wordForm') wordForm: NgForm;

  constructor(
    private backendSrv: FirebaseService,
    private gameSrv: GameService,
    private wordSrv: WordService,
    private router: Router ) { }

  ngOnInit() {
    this.backendSrv.getDB()
      .subscribe(
        (data) => {
          this.seasons = data.json();
        }
      );
    this.backendSrv.refreshCachedData.subscribe(
      (data: SeasonModel[]) => {
        console.log('I am reding the info on this channel', data);
        this.seasons = data;
        this.showAddSeason = false;
        this.triggerAlert('season', 'deleted!', 'alert-danger');
      }
    );
  }

  ngOnDestroy() {
    this.backendSrv.refreshCachedData.unsubscribe();
  }

  /*
  * Seasons
  */

  onSelectSeason(seasonId: number) {
    this.hideAllAddForms();
    this.selectedSeason = seasonId;
    this.activeSeason = this.seasons[seasonId];
    this.episodes = this.activeSeason['episodes'];
    this.selectedEpisode = -1;
  }

  addNewSeason() {
    this.hideAllAddForms();

    this.showAddSeason = true;
    this.editMode = false;
    this.seasonForm.reset();
  }

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

  onEditSeason(seasonId: number) {
    this.hideAllAddForms(); 
    this.selectedEpisode = -1;
    this.showAddSeason = true;
    this.editMode = true;

    this.selectedSeason = seasonId;
    this.activeSeason = this.seasons[seasonId];

    this.seasonForm.setValue({
      'catTitle': this.activeSeason['title'],
      'catEn': this.activeSeason['en'],
      'catEs': this.activeSeason['es']
    });
  }

  onUpdateSeason() {
    this.activeSeason['title'] = this.seasonForm.value.catTitle;
    this.activeSeason['en'] = this.seasonForm.value.catEn;
    this.activeSeason['es'] = this.seasonForm.value.catEs;
    const that = this;
    this.backendSrv.saveGame(this.seasons)
      .subscribe(
        (response: Response) => { 
          that.seasonForm.reset();
          that.showAddSeason = false;
          that.triggerAlert('season');
        }
      );
  }

  onDeleteSeason() {
    if (confirm('About to delete an entire Season.')) {
      this.backendSrv.deleteSeason(this.selectedSeason);
    }
  }

  /*
  * Episodes
  */

  onSelectEpisode(episodeId: number) {
    this.hideAllAddForms();
    this.selectedEpisode = episodeId;
    this.activeEpisode = this.activeSeason['episodes'][episodeId];
    if (!this.activeEpisode['words']) {
      this.activeEpisode['words'] = {
        en: [],
        es: []
      };
    }

    this.activeWordList = this.activeEpisode['words']['en'];
    this.secondWordList = this.activeEpisode['words']['es'];
  }

  addNewEpisode() { 
    this.hideAllAddForms();
    this.showAddEpisode = true;
    this.editMode = false;
    this.episodeForm.reset();
  }

  onEditEpisode(episodeId: number) {
    this.hideAllAddForms(); 
    this.showAddEpisode = true;
    this.editMode = true;

    this.selectedEpisode = episodeId;
    console.log('selecte episode', this.selectedEpisode);
    console.log('this.selectedSeason', this.activeSeason)
    this.activeEpisode = this.activeSeason['episodes'][episodeId];
    
    if (!this.activeEpisode['words']) {
      this.activeEpisode['words'] = {
        en: [],
        es: []
      }
    }

    this.activeWordList = this.activeEpisode['words']['en'];
    this.secondWordList = this.activeEpisode['words']['es'];
    
    this.episodeForm.setValue({
      'epiTitle': this.activeEpisode['title'],
      'epiEn': this.activeEpisode['en'],
      'epiDifficulty': 'normal',
      'epiEs': this.activeEpisode['es']
    });
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
      {'en': [], 'es': []},
      {'en': this.gameSrv.generateGameGrid(), 'es': this.gameSrv.generateGameGrid()}
    ));

    console.log('this the new one???');
    console.log(this.activeSeason['episodes']);
    console.log('all details:', this.seasons);

    this.backendSrv.saveGame(this.seasons)
      .subscribe((response: Response)=>{
        console.log('this.activeSeason', this.activeSeason);
        this.episodes = this.activeSeason['episodes'];
        this.triggerAlert('episode');
      });
  }

  onOpenEpisode() {
    this.router.navigate(['/designer', this.selectedSeason, this.selectedEpisode]);
  }

  onUpdateEpisode() {
    this.activeEpisode['title'] = this.episodeForm.value.epiTitle;
    this.activeEpisode['en'] = this.episodeForm.value.epiEn;
    this.activeEpisode['es'] = this.episodeForm.value.epiEs;
    const that = this;
    this.backendSrv.saveGame(this.seasons)
      .subscribe(
        (response: Response) => { 
          that.episodeForm.reset();
          that.showAddEpisode = false;
          that.triggerAlert('episode');
        }
      );
  }

  onDeleteEpisode() {

  }

  /*
  * Words
  */

  addNewWord() { 
    this.hideAllAddForms(); 
    this.showAddWord = true; 
    this.editMode = false;
    this.wordForm.reset();
  }

  onEditWord(wordId: number) {
    this.hideAllAddForms(); 
    this.showAddWord = true;
    this.editMode = true;

    this.selectedWord = wordId;
    this.activeWord = this.activeEpisode['words'][this.selectedWord];
    this.wordForm.setValue({
      'wordEn': this.activeEpisode['words'][this.selectedWord]['en'],
      'wordEs': this.activeEpisode['words'][this.selectedWord]['es']
    });
  }

  onUpdateWord() {
    this.activeEpisode['words'][this.activeWord]['en'] = this.wordForm.value.wordEn;
    this.activeEpisode['words'][this.activeWord]['es'] = this.wordForm.value.wordEs;

    console.log('this seasons:', this.seasons);
    const that = this;
    this.backendSrv.saveGame(this.seasons)
      .subscribe(
        (response: Response) => { 
          that.wordForm.reset();
          that.showAddWord = false;
          that.triggerAlert('word');
        }
      );
  }

  onSaveNewWord(wordForm: NgForm) {
    const colorCode = this.wordSrv.getHslColor(this.activeEpisode['words']['en'].length * 30),
      fontColor = this.wordSrv.getFontColor(this.activeEpisode['words']['en'].length * 30);

    this.activeEpisode['words']['en'].push(new WordModel(
      wordForm.value.wordEn,
      colorCode,
      fontColor,
      false,
      false
    ));

    this.activeEpisode['words']['es'].push(new WordModel(
      wordForm.value.wordEs,
      colorCode,
      fontColor,
      false,
      false
    ));

    this.backendSrv.saveGame(this.seasons)
      .subscribe((response: Response)=>{
        this.triggerAlert('word');
        wordForm.reset();
        this.wordInput.nativeElement.focus();
      });
  }

  onDeleteWord() {
    
  }

  onCancel() {
    this.showAddSeason = false;
    this.showAddEpisode = false;
    this.showAddWord = false;
  }

  onResetDB() {
    if (confirm("Are you sure to reset DB to it's original state?")) {
      this.backendSrv.restoreGameDB()
        .subscribe(
          (response: Response) => {
            console.log('test', response.json());
            this.seasons = response.json();
            this.showAddSeason = false;
            this.showAddEpisode = false;
            this.showAddWord = false;
            this.selectedSeason = -1;
            this.selectedEpisode = -1;
            this.selectedWord = -1;
          }
        );
    }
  }

  private triggerAlert(type: string, message: string = ' saved!', alertType: string = 'alert-success') {
    if (this.alertType !== alertType) {
      this.alertType = alertType;
    }

    if (type === 'episode') {
      this.showEpisodeAlert = true;
      this.alertMsg = `Episode ${message}`;
      this.alertType = alertType;
    } else if (type === 'season') {
      this.showSeasonAlert = true;
      this.alertMsg = `Season ${message}`;
    } else if (type === 'word') {
      this.showWordAlert = true;
      this.alertMsg = `Word Combination ${message}`;
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
