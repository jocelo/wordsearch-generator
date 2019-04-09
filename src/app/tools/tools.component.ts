import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';
import { NotificationsService } from '../shared/services/notifications.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit  {
  wordsList: object[] = [];
  @ViewChild('newWord') newWord: ElementRef;
  @ViewChild('gameName') gameName: ElementRef;
  
  previousSelected: any;
  wordSelected: string;
  wordsAlertMessage: string;
  toolsAlertMessage: string;
  gameAlertMessage: string;
  selectedW: number = -1;
  gameString: string;

  constructor(
    private wordSrv: WordService,
    private notificationsSrv: NotificationsService) { }

  ngOnInit() {
    this.wordsAlertMessage = '';
    this.toolsAlertMessage = '';
    this.gameAlertMessage = '';
    this.wordsList = this.wordSrv.getWords();

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
    this.gameString = 'dump data here';
  }

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

  selectWord(word: any, idx: number) {
    this.wordSrv.setSelected(word.label, idx);
    this.selectedW = idx;
  }

  onGenerate() {
    if ( this.gameName.nativeElement.value.trim() === '' ) {
      console.log('inside');
      this.notificationsSrv.game.next('Specify a name for the game.');
    } else if ( this.wordSrv.allWordsUsed() ) {
      data = JSON.stringify( this.wordSrv.generateStructure() );
    } else {
      this.notificationsSrv.word.next('Please use all words before continue.');
    }
  }

}
