import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordService } from '../shared/services/word.service';
import { ToolsService } from '../shared/services/tools.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  wordsList: object[] = [];
  @ViewChild('newWord') newWord: ElementRef;
  
  previousSelected: any;
  wordSelected: string;

  constructor(private wordSrv: WordService) { }

  ngOnInit() {
    this.wordsList = this.wordSrv.getWords();
  }

  onAddWord() {
    const newWord = String(this.newWord.nativeElement.value).trim();
    if (newWord) {
      this.wordSrv.addWord(newWord);
    }
  }

  selectWord(whatIsThis: any) {
    if (this.previousSelected) {
      this.previousSelected.classList.remove('selected');
    }

    whatIsThis.target.classList.add('selected');
    this.previousSelected = whatIsThis.target;
    this.wordSrv.setSelected(whatIsThis.target.innerText);
  }

}
